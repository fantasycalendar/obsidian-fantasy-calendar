import type { WorkspaceLeaf } from "obsidian";
import type { Calendar } from "src/@types";
import type FantasyCalendar from "src/main";
import FantasyCalendarView from "src/view/view";

export const FULL_VIEW = "FANTASY_CALENDAR_FULL_VIEW";

import CalendarUI from "./ui/Calendar.svelte";

import "./view.css";

export default class FullView extends FantasyCalendarView {
    protected _app: CalendarUI;
    constructor(public leaf: WorkspaceLeaf, public plugin: FantasyCalendar) {
        super(plugin, leaf);
        this.contentEl.addClass("fantasy-calendar-full");
        if (this.plugin.data.defaultCalendar) {
            this.setCurrentCalendar(this.plugin.data.defaultCalendar);
        }
    }

    getDisplayText() {
        return "Fantasy Calendar";
    }
    getViewType() {
        return FULL_VIEW;
    }
    setCurrentCalendar(calendar: Calendar) {
        this.calendar = calendar;
        if (this._app) {
            this._app.$destroy();
        }
        this._app = new CalendarUI({
            target: this.contentEl,
            props: { data: this.calendar, fullView: true }
        });
    }
}
