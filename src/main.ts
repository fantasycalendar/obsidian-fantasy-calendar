import { Platform, Plugin, WorkspaceLeaf } from "obsidian";

import FantasyCalendarSettings from "./settings/settings";

import type { Calendar, FantasyCalendarData } from "./@types";

import FantasyCalendarView, { VIEW_TYPE, FULL_VIEW } from "./view/view";

import "./main.css";

declare module "obsidian" {
    interface Workspace {
        on(name: "fantasy-calendars-updated", callback: () => any): EventRef;
    }
}

export const MODIFIER_KEY = Platform.isMacOS ? "Meta" : "Control";

export const DEFAULT_CALENDAR: Calendar = {
    name: null,
    description: null,
    id: null,
    static: {
        firstWeekDay: null,
        overflow: true,
        weekdays: [],
        months: []
    },
    current: {
        year: null,
        month: null,
        day: null
    },
    events: [],
    categories: []
};

export const DEFAULT_DATA: FantasyCalendarData = {
    calendars: [],
    currentCalendar: null,
    defaultCalendar: null
};

export default class FantasyCalendar extends Plugin {
    data: FantasyCalendarData;
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

        this.addSettingTab(new FantasyCalendarSettings(this));
        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) => new FantasyCalendarView(this, leaf)
        );
        this.app.workspace.onLayoutReady(() => this.addCalendarView());
        this.addRibbonIcon(VIEW_TYPE, "Open Big Fantasy Calendar", (evt) => {
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
            name: "Open Big Fantasy Calendar",
            callback: () => {
                this.addFullCalendarView();
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
    }

    async addCalendarView() {
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE
        });
        if (this.view) this.app.workspace.revealLeaf(this.view.leaf);
    }
    async addFullCalendarView() {
        this.app.workspace.getLeaf(false).setViewState({ type: FULL_VIEW });
        if (this.full) this.app.workspace.revealLeaf(this.full.leaf);
    }
    async loadSettings() {
        this.data = {
            ...DEFAULT_DATA,
            ...(await this.loadData())
        };
        if (!this.data.defaultCalendar && this.data.calendars.length) {
            this.data.defaultCalendar = this.data.calendars[0];
        }
    }

    async saveCalendar() {
        await this.saveSettings();
        this.app.workspace.trigger("fantasy-calendars-updated");
    }

    async saveSettings() {
        this.saveData(this.data);
    }
}
