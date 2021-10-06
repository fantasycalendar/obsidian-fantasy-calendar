import {
    addIcon,
    App,
    ButtonComponent,
    ExtraButtonComponent,
    Modal,
    Notice,
    PluginSettingTab,
    Setting,
    TextAreaComponent,
    TextComponent
} from "obsidian";
import { DEFAULT_CALENDAR } from "../main";
import type FantasyCalendar from "../main";

import Weekdays from "./ui/Weekdays.svelte";
import Months from "./ui/Months.svelte";
import EventsUI from "./ui/Events.svelte";

import "./settings.css";
import { nanoid } from "nanoid";
import type { Calendar, Event } from "src/@types";
export enum Recurring {
    none = "None",
    monthly = "Monthly",
    yearly = "Yearly"
}

addIcon(
    "fantasy-calendar-grip",
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grip-lines" class="svg-inline--fa fa-grip-lines fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M496 288H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-128H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z"/></svg>`
);

export default class FantasyCalendarSettings extends PluginSettingTab {
    calendarUI: HTMLDivElement;
    get data() {
        return this.plugin.data;
    }
    constructor(public plugin: FantasyCalendar) {
        super(plugin.app, plugin);
    }
    async display() {
        this.containerEl.empty();
        this.containerEl.createEl("h2", { text: "Fantasy Calendars" });
        this.containerEl.addClass("fantasy-calendar-settings");

        this.calendarUI = this.containerEl.createDiv("fantasy-calendars");

        this.buildCalendarUI();
    }
    buildCalendarUI() {
        this.calendarUI.empty();

        new Setting(this.calendarUI)
            .setHeading()
            .setName("Add New Calendar")
            .addButton((button: ButtonComponent) =>
                button
                    .setTooltip("Add Calendar")
                    .setButtonText("+")
                    .onClick(() => {
                        const modal = new CreateCalendarModal(this.plugin);
                        modal.onClose = async () => {
                            if (!modal.saved) return;
                            const calendar = { ...modal.calendar };
                            calendar.current = {
                                year: 1,
                                month: 1,
                                day: 1
                            };
                            this.data.calendars.push({ ...calendar });
                            await this.plugin.saveCalendar();

                            this.showCalendars(existing);
                        };
                        modal.open();
                    })
            );

        const existing = this.calendarUI.createDiv("existing-calendars");

        this.showCalendars(existing);
    }
    showCalendars(element: HTMLElement) {
        element.empty();
        if (!this.data.calendars.length) {
            element.createSpan({
                text: "No calendars created! Create a calendar to see it here."
            });
            return;
        }
        for (let calendar of this.data.calendars) {
            new Setting(element)
                .setName(calendar.name)
                .setDesc(calendar.description)
                .addExtraButton((b) => {
                    b.setIcon("pencil").onClick(() => {
                        const modal = new CreateCalendarModal(
                            this.plugin,
                            calendar
                        );
                        modal.onClose = async () => {
                            if (!modal.saved) return;
                            calendar = { ...modal.calendar };
                            await this.plugin.saveCalendar();

                            this.showCalendars(element);
                        };
                        modal.open();
                    });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash").onClick(() => {
                        const modal = new ConfirmModal(this.plugin.app);
                        modal.onClose = async () => {
                            if (!modal.delete) return;
                            this.plugin.data.calendars =
                                this.plugin.data.calendars.filter(
                                    (c) => c.id != calendar.id
                                );
                            await this.plugin.saveCalendar();

                            this.showCalendars(element);
                        };
                        modal.open();
                    });
                });
        }
    }
}

class ConfirmModal extends Modal {
    delete: boolean = false;
    async display() {
        this.contentEl.empty();
        this.contentEl.createSpan({
            text: "Are you sure you want to delete this calendar?"
        });
        new ButtonComponent(this.contentEl)
            .setButtonText("Delete")
            .onClick(() => {
                this.delete = true;
                this.close();
            });
        new ButtonComponent(this.contentEl)
            .setButtonText("Cancel")
            .setCta()
            .onClick(() => {
                this.close();
            });
    }
}

class CreateCalendarModal extends Modal {
    calendar: Calendar = { ...DEFAULT_CALENDAR };
    saved: boolean = false;
    editing: boolean = false;
    weekdayEl: any;
    monthEl: HTMLDivElement;
    infoEl: HTMLDivElement;
    buttonsEl: HTMLDivElement;
    canSave: boolean = false;
    eventEl: HTMLDivElement;
    get static() {
        return this.calendar.static;
    }
    get week() {
        return this.static.weekdays;
    }
    get months() {
        return this.static.months;
    }
    get events() {
        return this.calendar.events;
    }
    constructor(public plugin: FantasyCalendar, existing?: Calendar) {
        super(plugin.app);
        console.log("🚀 ~ file: settings.ts ~ line 147 ~ existing", existing);
        this.calendar.id = nanoid(6);
        if (existing) {
            this.editing = true;
            this.calendar = { ...existing };
        }
        this.containerEl.addClass("create-fantasy-calendar");
    }
    async display() {
        this.contentEl.empty();

        this.contentEl.createEl("h3", {
            text: this.editing ? "Edit Calendar" : "New Calendar"
        });

        this.infoEl = this.contentEl.createDiv();
        this.buildInfo();

        this.weekdayEl = this.contentEl.createDiv();
        this.buildWeekdays();
        this.monthEl = this.contentEl.createDiv("fantasy-calendar-container");
        this.buildMonths();
        this.eventEl = this.contentEl.createDiv("fantasy-calendar-container");
        this.buildEvents();

        this.buttonsEl = this.contentEl.createDiv("fantasy-context-buttons");
        this.buildButtons();
    }
    buildInfo() {
        this.infoEl.empty();
        const element = this.infoEl.createEl("details", {
            attr: { open: true }
        });
        element.createEl("summary").createEl("h4", { text: "Basic Info" });
        new Setting(element).setName("Calendar Name").addText((t) => {
            t.setValue(this.calendar.name).onChange(
                (v) => (this.calendar.name = v)
            );
        });
        new Setting(element).setName("Calendar Description").addText((t) => {
            t.setValue(this.calendar.description).onChange(
                (v) => (this.calendar.description = v)
            );
        });
        new Setting(element)
            .setName("First Day")
            .setDesc(
                "This only effects which day of the week the first year starts on."
            )
            .addText((t) => {
                t.setValue(`${this.calendar.static.firstWeekDay}`).onChange(
                    (v) => {
                        this.calendar.static.firstWeekDay = Number(v) - 1;
                    }
                );
                t.inputEl.setAttr("type", "number");
            });
        new Setting(element)
            .setName("Overflow Weeks")
            .setDesc(
                "Turn this off to make each month start on the first of the week."
            )
            .addToggle((t) => {
                t.setValue(this.calendar.static.overflow).onChange((v) => {
                    this.calendar.static.overflow = v;
                });
            });
    }
    buildWeekdays() {
        this.weekdayEl.empty();
        const element = this.weekdayEl.createEl("details", {});
        element.createEl("summary").createEl("h4", { text: "Weekdays" });
        const weekday = new Weekdays({
            target: element,
            props: {
                weekdays: this.week
            }
        });

        weekday.$on("weekday-update", (e) => {
            this.calendar.static.weekdays = e.detail;

            if (
                !this.calendar.static.firstWeekDay &&
                this.calendar.static.weekdays.length
            ) {
                this.calendar.static.firstWeekDay = 1;
                this.buildInfo();
            }

            this.checkCanSave();
        });
    }
    buildMonths() {
        this.monthEl.empty();
        const element = this.monthEl.createEl("details", {});
        element.createEl("summary").createEl("h4", { text: "Months" });
        const months = new Months({
            target: element,
            props: {
                months: this.months
            }
        });

        months.$on("month-update", (e) => {
            this.calendar.static.months = e.detail;

            this.checkCanSave();
        });
    }
    buildEvents() {
        this.eventEl.empty();
        const element = this.eventEl.createEl("details", {});
        element.createEl("summary").createEl("h4", { text: "Events" });
        const events = new EventsUI({
            target: element,
            props: {
                events: this.events
            }
        });
        events.$on("new-event", async (e: CustomEvent<Event>) => {
            const modal = new CreateEventModal(this.app, e.detail);
            modal.onClose = () => {
                if (!modal.saved) return;
                if (modal.editing) {
                    const index = this.calendar.events.indexOf(
                        this.calendar.events.find(
                            (e) => e.id === modal.event.id
                        )
                    );

                    this.calendar.events = this.calendar.events.splice(
                        index,
                        1,
                        { ...modal.event }
                    );
                } else {
                    this.calendar.events.push({ ...modal.event });
                }
                events.$set({ events: this.events });
                this.plugin.saveCalendar();
            };
            modal.open();
        });

        this.eventEl.setAttr(
            `style`,
            `--event-max-width: ${
                this.eventEl.getBoundingClientRect().width
            }px;`
        );
    }
    checkCanSave() {
        if (
            this.months.length &&
            this.months.every((m) => m.name?.length) &&
            this.months.every((m) => m.length > 0) &&
            this.week.length &&
            this.week.every((d) => d.name?.length) &&
            this.calendar.name.length &&
            this.calendar.static.firstWeekDay < this.week.length
        ) {
            this.canSave = true;
        }
    }
    buildButtons() {
        this.buttonsEl.empty();

        new ButtonComponent(this.buttonsEl)
            .setCta()
            .setButtonText(this.editing ? "Save" : "Create")
            .onClick(() => {
                console.log(
                    "🚀 ~ file: settings.ts ~ line 278 ~ this.canSave",
                    this.canSave
                );
                if (!this.canSave) {
                    if (!this.calendar.name?.length) {
                        new Notice("The calendar name is required!");
                    } else if (!this.week.length) {
                        new Notice("At least one weekday is required.");
                    } else if (!this.week.every((w) => w.name?.length)) {
                        new Notice("Every weekday must have a name.");
                    } else if (!this.months.length) {
                        new Notice("At least one month is required.");
                    } else if (!this.months.every((m) => m.name?.length)) {
                        new Notice("Every month must have a name.");
                    } else if (!this.months.every((m) => m.length)) {
                        new Notice("Every month must have a length.");
                    } else if (
                        this.calendar.static.firstWeekDay >= this.week.length
                    ) {
                        new Notice(
                            "The first day of the week must be a valid weekday."
                        );
                    }
                    return;
                }
                this.saved = true;
                this.close();
            });
        new ExtraButtonComponent(this.buttonsEl)
            .setTooltip("Cancel")
            .setIcon("cross")
            .onClick(() => this.close());
    }
    onOpen() {
        this.display();
    }
}

export class CreateEventModal extends Modal {
    saved = false;
    event: Event = {
        name: null,
        description: null,
        date: {
            month: null,
            day: null,
            year: null
        },
        id: nanoid(6),
        note: null
        /* recurring: "none" */
    };
    editing: boolean;
    infoEl: HTMLDivElement;
    dateEl: HTMLElement;
    monthEl: HTMLDivElement;
    dayEl: HTMLDivElement;
    yearEl: HTMLDivElement;
    fieldsEl: HTMLDivElement;
    constructor(
        app: App,
        event?: Event,
        date?: { month: number; day: number; year: number }
    ) {
        super(app);
        if (event) {
            this.event = { ...event };
            this.editing = true;
        }
        if (date) {
            this.event.date = { ...date };
        }
        this.containerEl.addClass("fantasy-calendar-create-event");
    }

    async display() {
        this.contentEl.empty();
        this.contentEl.createEl("h3", {
            text: this.editing ? "Edit Event" : "New Event"
        });

        this.infoEl = this.contentEl.createDiv("event-info");
        this.buildInfo();

        this.dateEl = this.contentEl.createDiv("event-date");
        this.buildDate();

        new Setting(this.contentEl)
            .addButton((b) => {
                b.setButtonText("Save")
                    .setCta()
                    .onClick(() => {
                        if (!this.event.name?.length) {
                            new Notice("The event must have a name.");
                            return;
                        }
                        this.saved = true;
                        this.close();
                    });
            })
            .addExtraButton((b) => {
                b.setIcon("cross")
                    .setTooltip("Cancel")
                    .onClick(() => this.close());
            });
    }
    buildDate() {
        this.dateEl.empty();

        this.fieldsEl = this.dateEl.createDiv("event-date-fields");

        this.buildDateFields();

        /* new Setting(this.contentEl)
            .setName("Recurring")
            .setDesc("Event will re-occur on the specified interval.")
            .addDropdown((d) => {
                d.addOptions(Recurring)
                    .setValue(this.event.recurring)
                    .onChange((v: keyof typeof Recurring) => {
                        this.event.recurring = v;
                    });
            }); */
    }
    buildDateFields() {
        this.fieldsEl.empty();
        const dayEl = this.fieldsEl.createDiv("event-date-field");
        dayEl.createEl("label", { text: "Day" });
        const day = new TextComponent(dayEl)
            .setPlaceholder("Day")
            .setValue(`${this.event.date.day}`)
            .onChange((v) => {
                this.event.date.day = Number(v);
            });
        day.inputEl.setAttr("type", "number");

        const monthEl = this.fieldsEl.createDiv("event-date-field");
        monthEl.createEl("label", { text: "Month" });
        const month = new TextComponent(monthEl)
            .setPlaceholder("Month")
            .setValue(`${this.event.date.month}`)
            .onChange((v) => {
                this.event.date.month = Number(v);
            });
        month.inputEl.setAttr("type", "number");

        const yearEl = this.fieldsEl.createDiv("event-date-field");
        yearEl.createEl("label", { text: "Year" });
        const year = new TextComponent(yearEl)
            .setPlaceholder("Year")
            .setValue(`${this.event.date.year}`)
            .onChange((v) => {
                this.event.date.year = Number(v);
            });
        year.inputEl.setAttr("type", "number");
    }
    buildInfo() {
        this.infoEl.empty();
        new Setting(this.infoEl)
            .setName("Note")
            .setDesc("Link the event to a note.")
            .addText((t) =>
                t
                    .setValue(this.event.note)
                    .onChange((v) => (this.event.note = v))
            );

        new Setting(this.infoEl).setName("Event Name").addText((t) =>
            t
                .setPlaceholder("Event Name")
                .setValue(this.event.name)
                .onChange((v) => {
                    this.event.name = v;
                })
        );

        const descriptionEl = this.infoEl.createDiv("event-description");
        descriptionEl.createEl("label", { text: "Event Description" });
        new TextAreaComponent(descriptionEl)
            .setPlaceholder("Event Description")
            .setValue(this.event.description)
            .onChange((v) => {
                this.event.description = v;
            });
    }
    async onOpen() {
        await this.display();
    }
}