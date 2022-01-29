import {
    addIcon,
    Component,
    Notice,
    Platform,
    Plugin,
    Vault,
    WorkspaceLeaf
} from "obsidian";

import FantasyCalendarSettings from "./settings/settings";

import type { Calendar, Event, FantasyCalendarData } from "./@types";

import FantasyCalendarView, {
    VIEW_TYPE,
    FULL_VIEW
    /* FullCalendarView */
} from "./view/view";

import "./main.css";
import { CalendarEventTree, Watcher } from "./watcher/watcher";
import { API } from "./api/api";
import copy from "fast-copy";

declare module "obsidian" {
    interface Workspace {
        on(name: "fantasy-calendars-updated", callback: () => any): EventRef;
        on(
            name: "fantasy-calendars-event-update",
            callback: (tree: CalendarEventTree) => any
        ): EventRef;
        on(
            name: "fantasy-calendar-settings-change",
            callback: () => any
        ): EventRef;
        trigger(name: "fantasy-calendars-updated"): void;
        trigger(name: "fantasy-calendar-settings-change"): void;
        trigger(
            name: "fantasy-calendars-event-update",
            tree: CalendarEventTree
        ): void;
        trigger(
            name: "link-hover",
            popover: any, //hover popover, but don't need
            target: HTMLElement, //targetEl
            note: string, //linkText
            source: string //source
        ): void;
    }
    interface App {
        plugins: {
            getPlugin(plugin: "obsidian-timelines"): {
                settings: {
                    timelineTag: string;
                };
            };
        };
    }
}

export const MODIFIER_KEY = Platform.isMacOS ? "Meta" : "Control";

export const DEFAULT_CALENDAR: Calendar = {
    name: null,
    description: null,
    id: null,
    static: {
        incrementDay: false,
        firstWeekDay: null,
        overflow: true,
        weekdays: [],
        months: [],

        moons: [],
        displayMoons: true,
        displayDayNumber: false,
        leapDays: [],
        eras: []
    },
    current: {
        year: 1,
        month: null,
        day: null
    },
    events: [],
    categories: []
};

export const DEFAULT_DATA: FantasyCalendarData = {
    calendars: [],
    currentCalendar: null,
    defaultCalendar: null,
    eventPreview: false,
    configDirectory: null,
    path: "/",
    parseDates: false,
    dateFormat: "YYYY-MM-DD",
    dailyNotes: false,
    version: {
        major: null,
        minor: null,
        patch: null
    },
    supportTimelines: false,
    timelineTag: "#timeline",
    syncTimelines: true,
    autoParse: true,
    settingsToggleState: {
        calendars: false,
        events: false
    }
};

export default class FantasyCalendar extends Plugin {
    api = new API(this);
    async addNewCalendar(calendar: Calendar) {
        this.data.calendars.push({ ...calendar });
        if (!this.data.defaultCalendar) {
            this.data.defaultCalendar = calendar.id;
        }
        await this.saveCalendar();
        /* this.watcher.registerCalendar(calendar); */
    }
    data: FantasyCalendarData;
    watcher = new Watcher(this);
    get currentCalendar() {
        return this.data.calendars.find(
            (c) => c.id == this.data.currentCalendar
        );
    }
    get canUseDailyNotes() {
        return this.dailyNotes._loaded;
    }
    get dailyNotes() {
        return this.app.internalPlugins.getPluginById("daily-notes");
    }
    get canUseTimelines() {
        return this.app.plugins.getPlugin("obsidian-timelines") != null;
    }
    get syncTimelines() {
        return this.data.syncTimelines && this.canUseTimelines;
    }
    get timelineTag() {
        if (this.syncTimelines) {
            return this.app.plugins.getPlugin("obsidian-timelines").settings
                .timelineTag;
        } else {
            return this.data.timelineTag;
        }
    }
    get format() {
        return (
            (this.data.dailyNotes && this.canUseDailyNotes
                ? this.dailyNotes.instance.options.format
                : this.data.dateFormat) ?? "YYYY-MM-DD"
        );
    }
    get defaultCalendar() {
        return (
            this.data.calendars.find(
                (c) => c.id == this.data.defaultCalendar
            ) ?? this.data.calendars[0]
        );
    }
    get view() {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
        const leaf = leaves.length ? leaves[0] : null;
        if (leaf && leaf.view && leaf.view instanceof FantasyCalendarView)
            return leaf.view;
    }
    get full() {
        const leaves = this.app.workspace.getLeavesOfType(FULL_VIEW);
        const leaf = leaves.length ? leaves[0] : null;
        if (leaf && leaf.view && leaf.view instanceof FantasyCalendarView)
            return leaf.view;
    }
    async onload() {
        console.log("Loading Fantasy Calendars v" + this.manifest.version);

        await this.loadSettings();

        this.watcher.load();

        addIcon(
            "fc-moon",
            `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="moon" class="svg-inline--fa fa-moon fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M279.135 512c78.756 0 150.982-35.804 198.844-94.775 28.27-34.831-2.558-85.722-46.249-77.401-82.348 15.683-158.272-47.268-158.272-130.792 0-48.424 26.06-92.292 67.434-115.836 38.745-22.05 28.999-80.788-15.022-88.919A257.936 257.936 0 0 0 279.135 0c-141.36 0-256 114.575-256 256 0 141.36 114.576 256 256 256zm0-464c12.985 0 25.689 1.201 38.016 3.478-54.76 31.163-91.693 90.042-91.693 157.554 0 113.848 103.641 199.2 215.252 177.944C402.574 433.964 344.366 464 279.135 464c-114.875 0-208-93.125-208-208s93.125-208 208-208z"/></svg>`
        );

        this.addSettingTab(new FantasyCalendarSettings(this));
        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => new FantasyCalendarView(this, leaf)
        );
        this.app.workspace.onLayoutReady(() => this.addCalendarView(true));
        this.addRibbonIcon(VIEW_TYPE, "Open Large Fantasy Calendar", (evt) => {
            this.app.workspace
                .getLeaf(evt.getModifierState(MODIFIER_KEY))
                .setViewState({ type: FULL_VIEW });
        });

        this.registerView(FULL_VIEW, (leaf: WorkspaceLeaf) => {
            return new FantasyCalendarView(this, leaf, { full: true });
        });

        this.addCommand({
            id: "open-fantasy-calendar",
            name: "Open Fantasy Calendar",
            callback: () => {
                this.addCalendarView();
            }
        });

        this.addCommand({
            id: "open-big-fantasy-calendar",
            name: "Open Large Fantasy Calendar",
            callback: () => {
                this.addFullCalendarView();
            }
        });

        this.addCommand({
            id: "toggle-moons",
            name: "Toggle Moons",
            checkCallback: (checking) => {
                const views = this.app.workspace.getLeavesOfType(VIEW_TYPE);
                if (views && views.length) {
                    if (!checking) {
                        (views[0].view as FantasyCalendarView).toggleMoons();
                    }
                    return true;
                }
            }
        });
        this.addCommand({
            id: "view-date",
            name: "View Date",
            checkCallback: (checking) => {
                const views = this.app.workspace.getLeavesOfType(VIEW_TYPE);
                if (views && views.length) {
                    if (!checking) {
                        (views[0].view as FantasyCalendarView).openDate();
                    }
                    return true;
                }
            }
        });
        this.addCommand({
            id: "view-date",
            name: "View Note Event",
            checkCallback: (checking) => {
                const views = this.app.workspace.getLeavesOfType(VIEW_TYPE);
                if (
                    views &&
                    views.length &&
                    views[0].view instanceof FantasyCalendarView
                ) {
                    const file = this.app.workspace.getActiveFile();
                    if (file) {
                        const event = views[0].view.calendar.events.find(
                            (e) => e.note == file.path
                        );
                        if (event) {
                            if (!checking) {
                                views[0].view.openDay(event.date);
                            }
                            return true;
                        }
                    }
                }
            }
        });
    }

    async onunload() {
        console.log("Unloading Fantasy Calendars v" + this.manifest.version);
        this.app.workspace
            .getLeavesOfType(VIEW_TYPE)
            .forEach((leaf) => leaf.detach());
        this.app.workspace
            .getLeavesOfType(FULL_VIEW)
            .forEach((leaf) => leaf.detach());
        this.watcher.unload();
    }

    async addCalendarView(startup: boolean = false) {
        if (startup && this.app.workspace.getLeavesOfType(VIEW_TYPE)?.length)
            return;
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE
        });
        if (this.view) this.app.workspace.revealLeaf(this.view.leaf);
    }
    async addFullCalendarView(startup: boolean = false) {
        if (startup && this.app.workspace.getLeavesOfType(FULL_VIEW)?.length)
            return;
        this.app.workspace.getLeaf(false).setViewState({ type: FULL_VIEW });
        if (this.full) this.app.workspace.revealLeaf(this.full.leaf);
    }
    async loadSettings() {
        this.data = {
            ...copy(DEFAULT_DATA),
            ...(await this.loadData())
        };
        if (
            this.configDirectory &&
            (await this.app.vault.adapter.exists(this.configFilePath))
        ) {
            this.data = Object.assign(
                {},
                this.data,
                JSON.parse(
                    await this.app.vault.adapter.read(this.configFilePath)
                )
            );
        }
        if (!this.data.defaultCalendar && this.data.calendars.length) {
            this.data.defaultCalendar = this.data.calendars[0].id;
        }
        /* if ((this.data.version?.major ?? 0) < 2 && this.data.calendars.length) {
            new Notice(
                "Fantasy Calendar can now parse note titles for events. See the ReadMe for more info!"
            );
        }
        const version = this.manifest.version.split(".").map((v) => Number(v));
        this.data.version = {
            major: version[0],
            minor: version[1],
            patch: version[2]
        }; */
    }

    async saveCalendar() {
        await this.saveSettings();
        this.app.workspace.trigger("fantasy-calendars-updated");
    }
    get configDirectory() {
        if (!this.data || !this.data.configDirectory) return;
        return `${this.data.configDirectory}/plugins/fantasy-calendar`;
    }
    get configFilePath() {
        if (!this.data.configDirectory) return;
        return `${this.configDirectory}/data.json`;
    }
    async saveSettings() {
        await this.saveData(this.data);
        this.app.workspace.trigger("fantasy-calendar-settings-change");
    }
    async saveData(data: FantasyCalendarData) {
        if (this.configDirectory) {
            try {
                if (
                    !(await this.app.vault.adapter.exists(this.configDirectory))
                ) {
                    await this.app.vault.adapter.mkdir(this.configDirectory);
                }
                await this.app.vault.adapter.write(
                    this.configFilePath,
                    JSON.stringify(data)
                );
            } catch (e) {
                console.error(e);
                new Notice(
                    "There was an error saving into the configured directory."
                );
            }
        }
        await super.saveData(data);
    }
}
