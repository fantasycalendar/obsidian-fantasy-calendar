import { nanoid } from "nanoid";
import { addIcon, DropdownComponent, ItemView, WorkspaceLeaf } from "obsidian";
import type { Calendar } from "src/@types";
import type { DayHelper } from "src/calendar";
import { CreateEventModal } from "src/settings/settings";
import type FantasyCalendar from "../main";

export const VIEW_TYPE = "FANTASY_CALENDAR";

import CalendarUI from "./ui/side/Calendar.svelte";

addIcon(
    VIEW_TYPE,
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14" role="img" viewBox="0 0 448 512"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"/><path fill="currentColor" d="M18.32 255.78L192 223.96l-91.28 68.69c-10.08 10.08-2.94 27.31 11.31 27.31h222.7c-9.44-26.4-14.73-54.47-14.73-83.38v-42.27l-119.73-87.6c-23.82-15.88-55.29-14.01-77.06 4.59L5.81 227.64c-12.38 10.33-3.45 30.42 12.51 28.14zm556.87 34.1l-100.66-50.31A47.992 47.992 0 0 1 448 196.65v-36.69h64l28.09 22.63c6 6 14.14 9.37 22.63 9.37h30.97a32 32 0 0 0 28.62-17.69l14.31-28.62a32.005 32.005 0 0 0-3.02-33.51l-74.53-99.38C553.02 4.7 543.54 0 533.47 0H296.02c-7.13 0-10.7 8.57-5.66 13.61L352 63.96 292.42 88.8c-5.9 2.95-5.9 11.36 0 14.31L352 127.96v108.62c0 72.08 36.03 139.39 96 179.38-195.59 6.81-344.56 41.01-434.1 60.91C5.78 478.67 0 485.88 0 494.2 0 504 7.95 512 17.76 512h499.08c63.29.01 119.61-47.56 122.99-110.76 2.52-47.28-22.73-90.4-64.64-111.36zM489.18 66.25l45.65 11.41c-2.75 10.91-12.47 18.89-24.13 18.26-12.96-.71-25.85-12.53-21.52-29.67z" style="&#10;    transform: scale(0.4125) translate(50%, 95%);&#10;"/></svg>`
);

export default class FantasyCalendarView extends ItemView {
    calendarDropdownEl: HTMLDivElement;
    protected _app: CalendarUI;
    constructor(
        public plugin: FantasyCalendar,
        public leaf: WorkspaceLeaf,
        public calendar?: Calendar
    ) {
        super(leaf);

        this.calendarDropdownEl = this.contentEl.createDiv();

        this.updateCalendars();
        this.plugin.registerEvent(
            this.plugin.app.workspace.on("fantasy-calendars-updated", () => {
                this.updateCalendars();
            })
        );
    }
    updateCalendars() {
        this.calendarDropdownEl.empty();
        if (this.plugin.data.calendars.length == 1) {
            this.setCurrentCalendar(this.plugin.data.calendars[0]);
            return;
        }
        const dropdown = new DropdownComponent(this.calendarDropdownEl)
            .addOptions(
                Object.fromEntries(
                    this.plugin.data.calendars.map((c) => [c.id, c.name])
                )
            )
            .setValue(this.calendar ? this.calendar.id : null)
            .onChange((v) => {
                this.setCurrentCalendar(
                    this.plugin.data.calendars.find((c) => c.id == v)
                );
            });
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
        this._app.$on("day-click", (event: CustomEvent<DayHelper>) => {
            const day = event.detail;

            if (day.events.length) {
            } else {
                const modal = new CreateEventModal(this.app, null, day.date);

                modal.onClose = () => {
                    if (!modal.saved) return;
                    this.calendar.events.push(modal.event);

                    //this._app.$set({ data: this.calendar });

                    this.plugin.saveCalendar();
                };

                modal.open();
            }
        });
    }

    async onOpen() {}

    async onClose() {}
    getViewType() {
        return VIEW_TYPE;
    }
    getDisplayText() {
        return "Fantasy Calendar";
    }
    getIcon() {
        return VIEW_TYPE;
    }

    async onunload() {}
}