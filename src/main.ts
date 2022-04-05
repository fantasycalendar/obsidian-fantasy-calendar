import { Notice, Platform, Plugin, WorkspaceLeaf } from "obsidian";

import FantasyCalendarSettings from "./settings/settings";

import type { Calendar, FantasyCalendarData } from "./@types";

import FantasyCalendarView, {
    VIEW_TYPE,
    FULL_VIEW
    /* FullCalendarView */
} from "./view/view";

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
        trigger(name: "fantasy-calendars-settings-loaded"): void;
        on(
            name: "fantasy-calendars-settings-loaded",
            callback: () => any
        ): EventRef;
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
        year: null,
        month: null,
        day: null
    },
    events: [],
    categories: [],
    autoParse: false,
    path: "/",
    supportTimelines: false,
    syncTimelines: true,
    timelineTag: "#timeline"
};

export const DEFAULT_DATA: FantasyCalendarData = {
    addToDefaultIfMissing: true,
    calendars: [],
    configDirectory: null,
    currentCalendar: null,
    dailyNotes: false,
    dateFormat: "YYYY-MM-DD",
    defaultCalendar: null,
    eventPreview: false,
    exit: {
        saving: false,
        event: false,
        calendar: false
    },
    eventFrontmatter: false,
    parseDates: false,
    settingsToggleState: {
        calendars: false,
        events: false,
        advanced: true
    },
    showIntercalary: false,
    version: {
        major: null,
        minor: null,
        patch: null
    },
    debug: false
};

export default class FantasyCalendar extends Plugin {
    api = new API(this);
    settingsLoaded: boolean;
    async addNewCalendar(calendar: Calendar, existing?: Calendar) {
        let shouldParse =
            !existing ||
            calendar.name != existing?.name ||
            (calendar.autoParse && !existing?.autoParse) ||
            calendar.path != existing?.path;
        if (existing == null) {
            this.data.calendars.push(calendar);
        } else {
            this.data.calendars.splice(
                this.data.calendars.indexOf(existing),
                1,
                calendar
            );
        }
        if (!this.data.defaultCalendar) {
            this.data.defaultCalendar = calendar.id;
        }
        if (shouldParse) this.watcher.start(calendar);
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
    syncTimelines(calendar: Calendar) {
        return calendar.syncTimelines && this.canUseTimelines;
    }
    timelineTag(calendar: Calendar) {
        let tag = calendar.timelineTag;
        if (this.syncTimelines(calendar)) {
            tag =
                this.app.plugins.getPlugin("obsidian-timelines").settings
                    .timelineTag;
        }
        if (!/^#/.test(tag)) {
            tag = `#${tag}`;
        }
        return tag ?? calendar.timelineTag ?? "";
    }
    get format() {
        return (
            (this.data.dailyNotes && this.canUseDailyNotes
                ? this.dailyNotes.instance.options.format
                : this.data.dateFormat) ?? "YYYY-MM-DD"
        );
    }
    get defaultCalendar(): Calendar {
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

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => new FantasyCalendarView(this, leaf)
        );
        this.registerView(FULL_VIEW, (leaf: WorkspaceLeaf) => {
            return new FantasyCalendarView(this, leaf, { full: true });
        });
        this.app.workspace.onLayoutReady(async () => {
            await this.loadSettings();

            this.watcher.load();

            this.addCommands();

            this.addSettingTab(new FantasyCalendarSettings(this));

            this.addCalendarView(true);
        });
        this.addRibbonIcon(VIEW_TYPE, "Open Large Fantasy Calendar", (evt) => {
            this.app.workspace
                .getLeaf(evt.getModifierState(MODIFIER_KEY))
                .setViewState({ type: FULL_VIEW });
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

    addCommands() {
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
        if (
            this.data.calendars.length &&
            !this.data.calendars.find(
                (cal) => cal.id == this.data.defaultCalendar
            )
        ) {
            this.data.defaultCalendar = this.data.calendars[0].id;
        }

        if ((this.data as any).autoParse && this.data.calendars.length) {
            for (const calendar of this.data.calendars) {
                calendar.autoParse = (this.data as any).autoParse;
                calendar.path = (this.data as any).path;
            }
            delete (this.data as any).autoParse;
            delete (this.data as any).path;
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
        this.settingsLoaded = true;
        this.app.workspace.trigger("fantasy-calendars-settings-loaded");
    }
    onSettingsLoad(callback: () => any) {
        if (this.settingsLoaded) {
            callback();
        } else {
            this.app.workspace.on("fantasy-calendars-settings-loaded", () =>
                callback()
            );
        }
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
