import { debounce, Notice, Platform, Plugin, WorkspaceLeaf } from "obsidian";

import FantasyCalendarSettings from "./settings/settings";

import type { Calendar, FantasyCalendarData } from "./@types";

/* import FantasyCalendarView, {
    VIEW_TYPE,
    FULL_VIEW
} from "./view/view"; */
import FantasyCalendarView, { VIEW_TYPE } from "./calendar/view";

import { CalendarEventTree, Watcher } from "./watcher/watcher";
import { API } from "./api/api";
import SettingsService from "./settings/settings.service";
import { FcEventHelper } from "./helper/event.helper";
import { CalendarStore, createCalendarStore } from "./stores/calendar.store";

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

declare global {
    interface Window {
        FantasyCalendarAPI?: API;
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
        eras: [],
    },
    current: {
        year: null,
        month: null,
        day: null,
    },
    events: [],
    categories: [],
    autoParse: false,
    path: "/",
    supportTimelines: false,
    syncTimelines: true,
    timelineTag: "timeline",
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
        calendar: false,
    },
    eventFrontmatter: false,
    parseDates: false,
    settingsToggleState: {
        calendars: false,
        events: false,
        advanced: true,
    },
    showIntercalary: false,
    version: {
        major: null,
        minor: null,
        patch: null,
    },
    debug: false,
};

export default class FantasyCalendar extends Plugin {
    api = new API(this);
    watcher: Watcher;
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
        await this.saveCalendars();
        /* this.watcher.registerCalendar(calendar); */
    }
    private $settingsService: SettingsService;
    get data() {
        return this.$settingsService.getData();
    }
    get calendars() {
        return this.$settingsService.getCalendars();
    }
    get currentCalendar() {
        return this.data.calendars.find(
            (c) => c.id == this.data.currentCalendar
        );
    }
    private readonly stores: WeakMap<Calendar, CalendarStore> = new WeakMap();
    getStore(calendar: Calendar) {
        if (!calendar) return null;
        if (!this.stores.has(calendar)) {
            this.stores.set(calendar, createCalendarStore(calendar));
        }
        return this.stores.get(calendar);
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
            tag = this.app.plugins
                .getPlugin("obsidian-timelines")
                .settings.timelineTag.replace("#", "");
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
    /* get full() {
        const leaves = this.app.workspace.getLeavesOfType(FULL_VIEW);
        const leaf = leaves.length ? leaves[0] : null;
        if (leaf && leaf.view && leaf.view instanceof FantasyCalendarView)
            return leaf.view;
    } */
    async onload() {
        console.log("Loading Fantasy Calendars v" + this.manifest.version);
        this.$settingsService = new SettingsService(this.app, this.manifest);
        await this.$settingsService.loadData();

        this.watcher = new Watcher(this);
        (window["FantasyCalendarAPI"] = this.api) &&
            this.register(() => delete window["FantasyCalendarAPI"]);

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => new FantasyCalendarView(leaf, this)
        );
        /* this.registerView(FULL_VIEW, (leaf: WorkspaceLeaf) => {
            return new FantasyCalendarView(this, leaf, { full: true });
        }); */
        this.app.workspace.onLayoutReady(async () => {
            await this.loadSettings();

            this.watcher.load();

            this.addCommands();

            this.addSettingTab(new FantasyCalendarSettings(this));

            this.addCalendarView(true);
        });
        /* this.addRibbonIcon(VIEW_TYPE, "Open Large Fantasy Calendar", (evt) => {
            this.app.workspace
                .getLeaf(evt.getModifierState(MODIFIER_KEY))
                .setViewState({ type: FULL_VIEW });
        }); */
    }

    async onunload() {
        console.log("Unloading Fantasy Calendars v" + this.manifest.version);
        this.app.workspace
            .getLeavesOfType(VIEW_TYPE)
            .forEach((leaf) => leaf.detach());
        /* this.app.workspace
            .getLeavesOfType(FULL_VIEW)
            .forEach((leaf) => leaf.detach()); */
        this.watcher.unload();
    }

    addCommands() {
        this.addCommand({
            id: "open-fantasy-calendar",
            name: "Open Fantasy Calendar",
            callback: () => {
                this.addCalendarView();
            },
        });

        /*         this.addCommand({
            id: "open-big-fantasy-calendar",
            name: "Open Large Fantasy Calendar",
            callback: () => {
                this.addFullCalendarView();
            },
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
            },
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
            },
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
            },
        }); */
    }

    async addCalendarView(startup: boolean = false) {
        if (startup && this.app.workspace.getLeavesOfType(VIEW_TYPE)?.length)
            return;
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE,
        });
        if (this.view) this.app.workspace.revealLeaf(this.view.leaf);
    }
    /*     async addFullCalendarView(startup: boolean = false) {
        if (startup && this.app.workspace.getLeavesOfType(FULL_VIEW)?.length)
            return;
        this.app.workspace.getLeaf(false).setViewState({ type: FULL_VIEW });
        if (this.full) this.app.workspace.revealLeaf(this.full.leaf);
    } */
    async loadSettings() {
        let data = {
            ...(await this.loadData())
        };
        if (data && data.configDirectory) {
            if (
                await this.app.vault.adapter.exists(
                    `${this.data.configDirectory}/data.json`
                )
            ) {
                try {
                    data = JSON.parse(
                        await this.app.vault.adapter.read(
                            `${this.data.configDirectory}/data.json`
                        )
                    );
                } catch (e) {}
            }
            if (!this.data.version.major || this.data.version.major < 3) {
                for (const calendar of this.data.calendars) {
                    
                // Ensure events in existing calendars have sort keys
                if (this.data.debug)
                    console.log("Updating cached events for %s", calendar.name);
                const helper = new FcEventHelper(calendar, false, this.format);
                calendar.events.forEach((e) => {
                    e.sort = helper.timestampForFcEvent(e);
                    const x: any = e;
                    delete x["timestamp"];
                    delete x["auto"];
                });
                }
            }
        }
        if (data && !data.transitioned) {
            await this.$settingsService.saveData(data);
            await super.saveData({ transitioned: true });
        }
    }
    onSettingsLoad(callback: () => any) {
        if (this.$settingsService.loaded) {
            callback();
        } else {
            this.app.workspace.on("fantasy-calendars-settings-loaded", () =>
                callback()
            );
        }
    }

    async saveCalendars() {
        await this.saveSettings();
        this.app.workspace.trigger("fantasy-calendars-updated");
    }
    async saveSettings() {
        await this.$settingsService.saveData();
    }
    async saveData(data: FantasyCalendarData) {}
}
