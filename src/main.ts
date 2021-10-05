import { Plugin, WorkspaceLeaf } from "obsidian";

import FantasyCalendarSettings from "./settings/settings";

import type { Calendar, FantasyCalendarData } from "./@types";

import FantasyCalendarView, { VIEW_TYPE } from "./view/view";

export const DEFAULT_CALENDAR: Calendar = {
    name: null,
    description: null,
    id: null,
    static: {
        firstWeekDay: null,
        overflow: true,
        week: [],
        months: [],
        leapDays: [],
        moons: [],
        seasons: []
    },
    current: {
        year: null,
        month: null,
        day: null
    },
    events: []
};

export const DEFAULT_DATA: FantasyCalendarData = {
    calendars: []
};

export default class FantasyCalendar extends Plugin {
    data: FantasyCalendarData;
    get view() {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
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
    }

    async onunload() {
        console.log("Unloading Fantasy Calendars v" + this.manifest.version);
    }

    async addCalendarView() {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
            return;
        }
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE
        });
        this.app.workspace.revealLeaf(this.view.leaf);
    }

    async loadSettings() {
        this.data = {
            ...DEFAULT_DATA,
            ...(await this.loadData())
        };
    }

    async saveSettings() {
        this.saveData(this.data);
    }
}
