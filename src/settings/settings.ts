import {
    addIcon,
    ButtonComponent,
    ExtraButtonComponent,
    Modal,
    Notice,
    PluginSettingTab,
    Setting
} from "obsidian";
import { DEFAULT_CALENDAR } from "../main";
import type FantasyCalendar from "../main";

import Weekdays from "./ui/Weekdays.svelte";
import Months from "./ui/Months.svelte";

import "./settings.css";
import { nanoid } from "nanoid";
import type { Calendar } from "src/@types";

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
    get static() {
        return this.calendar.static;
    }
    get week() {
        return this.static.weekdays;
    }
    get months() {
        return this.static.months;
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
        console.log(
            "🚀 ~ file: settings.ts ~ line 247 ~ this.canSave",
            this.canSave
        );
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
