import type { WorkspaceLeaf } from "obsidian";
import type { Calendar } from "src/@types";
import FantasyCalendarView from "src/view/view";

export const FULL_VIEW = "FANTASY_CALENDAR_FULL_VIEW";

import CalendarUI from "./ui/full/Calendar.svelte";

import './view.css';

export default class FullView extends FantasyCalendarView {
    protected _app: CalendarUI;
    constructor(public leaf: WorkspaceLeaf, public plugin: any) {
        super(plugin, leaf);
        this.contentEl.addClass("fantasy-calendar-full");
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
            props: { data: this.calendar }
        });
    }
}
