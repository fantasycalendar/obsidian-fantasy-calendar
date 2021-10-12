import {
    addIcon,
    ButtonComponent,
    DropdownComponent,
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
import Importer from "./import/importer";
import { PRESET_CALENDARS } from "../utils/presets";

import Weekdays from "./ui/Weekdays.svelte";
import Months from "./ui/Months.svelte";
import EventsUI from "./ui/Events.svelte";
import Categories from "./ui/Categories.svelte";

import "./settings.css";
import { nanoid } from "src/utils/functions";
import type { Calendar, Event, EventCategory } from "src/@types";

import { CreateEventModal } from "../modals/event";
import { confirmWithModal } from "../modals/confirm";

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
    infoEl: HTMLDivElement;
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

        this.infoEl = this.containerEl.createDiv();
        this.buildInfo();

        const importSetting = new Setting(this.containerEl)
            .setName("Import Calendar")
            .setDesc("Import calendar from ");
        importSetting.descEl.createEl("a", {
            href: "https://app.fantasy-calendar.com",
            text: "Fantasy Calendar",
            cls: "external-link"
        });
        const input = createEl("input", {
            attr: {
                type: "file",
                name: "merge",
                accept: ".json",
                multiple: true,
                style: "display: none;"
            }
        });
        input.onchange = async () => {
            const { files } = input;

            if (!files.length) return;
            try {
                const data = [];
                for (let file of Array.from(files)) {
                    data.push(JSON.parse(await file.text()));
                }
                const calendars = Importer.import(data);
                this.plugin.data.calendars.push(...calendars);
                await this.plugin.saveCalendar();
                this.buildCalendarUI();
            } catch (e) {
                new Notice(
                    `There was an error while importing the calendar${
                        files.length == 1 ? "" : "s"
                    }.`
                );
                console.error(e);
            }

            input.value = null;
        };
        importSetting.addButton((b) => {
            b.setButtonText("Choose Files");
            b.buttonEl.addClass("calendar-file-upload");
            b.buttonEl.appendChild(input);
            b.onClick(() => input.click());
        });

        this.calendarUI = this.containerEl.createDiv("fantasy-calendars");

        this.buildCalendarUI();
    }
    buildInfo() {
        this.infoEl.empty();
        new Setting(this.infoEl)
            .setName("Default Calendar to Open")
            .setDesc("Views will open to this calendar by default.")
            .addDropdown((d) => {
                d.addOption("none", "None");
                for (let calendar of this.data.calendars) {
                    d.addOption(calendar.id, calendar.name);
                }
                d.setValue(this.plugin.data.defaultCalendar);
                d.onChange((v) => {
                    if (v === "none") {
                        this.plugin.data.defaultCalendar = null;
                        this.plugin.saveSettings();
                        return;
                    }

                    this.plugin.data.defaultCalendar = v;
                    this.plugin.saveSettings();
                });
            });

        new Setting(this.infoEl)
            .setName("Display Event Previews")
            .setDesc(
                "Use the core Note Preview plugin to display event notes when hovered."
            )
            .addToggle((t) => {
                t.setValue(this.data.eventPreview).onChange((v) => {
                    this.data.eventPreview = v;
                    this.plugin.saveSettings();
                });
            });
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
                            this.data.calendars.push({ ...calendar });
                            if (!this.data.defaultCalendar) {
                                this.data.defaultCalendar = calendar.id;
                            }
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
                .setDesc(calendar.description ?? "")
                .addExtraButton((b) => {
                    b.setIcon("pencil").onClick(() => {
                        const modal = new CreateCalendarModal(
                            this.plugin,
                            calendar
                        );
                        modal.onClose = async () => {
                            if (!modal.saved) return;
                            this.data.calendars.splice(
                                this.data.calendars.indexOf(calendar),
                                1,
                                { ...modal.calendar }
                            );

                            await this.plugin.saveCalendar();

                            this.showCalendars(element);
                        };
                        modal.open();
                    });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash").onClick(async () => {
                        if (
                            !(await confirmWithModal(
                                this.app,
                                "Are you sure you want to delete this calendar?",
                                {
                                    cta: "Delete",
                                    secondary: "Cancel"
                                }
                            ))
                        )
                            return;
                        this.plugin.data.calendars =
                            this.plugin.data.calendars.filter(
                                (c) => c.id != calendar.id
                            );
                        await this.plugin.saveCalendar();
                        if (this.data.defaultCalendar == calendar.id) {
                            this.data.defaultCalendar =
                                this.data.calendars[0]?.id ?? null;
                        }

                        this.showCalendars(element);
                    });
                });
        }
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
    preset: Calendar;
    categoryEl: HTMLDivElement;
    eventsUI: EventsUI;
    infoDetailEl: HTMLDetailsElement;
    dateFieldEl: HTMLDivElement;
    uiEl: HTMLDivElement;
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
        this.calendar.id = nanoid(6);
        if (existing) {
            this.editing = true;
            this.calendar = { ...existing };
        }
        this.containerEl.addClass("fantasy-calendar-create-calendar");
    }
    async display() {
        this.contentEl.empty();

        this.contentEl.createEl("h3", {
            text: this.editing ? "Edit Calendar" : "New Calendar"
        });

        const presetEl = this.contentEl.createDiv(
            "fantasy-calendar-apply-preset"
        );
        new Setting(presetEl)
            .setName("Apply Preset")
            .setDesc("Apply a common fantasy calendar as a preset.")
            .addButton((b) => {
                b.setCta()
                    .setButtonText("Choose Preset")
                    .onClick(() => {
                        const modal = new CalendarPresetModal(this.app);
                        modal.onClose = () => {
                            if (!modal.saved) return;

                            this.calendar = { ...modal.preset };
                            this.display();
                        };
                        modal.open();
                    });
            });

        this.uiEl = this.contentEl.createDiv("fantasy-calendar-ui");

        this.buttonsEl = this.contentEl.createDiv("fantasy-context-buttons");
        this.buildButtons();
        this.infoEl = this.uiEl.createDiv("calendar-info");
        this.buildInfo();

        this.weekdayEl = this.uiEl.createDiv();
        this.buildWeekdays();
        this.monthEl = this.uiEl.createDiv("fantasy-calendar-container");
        this.buildMonths();
        this.eventEl = this.uiEl.createDiv("fantasy-calendar-container");
        this.buildEvents();
        this.categoryEl = this.uiEl.createDiv("fantasy-calendar-container");
        this.buildCategories();
    }
    buildInfo() {
        this.infoEl.empty();
        this.infoDetailEl = this.infoEl.createEl("details", {
            attr: { open: true }
        });
        this.infoDetailEl
            .createEl("summary")
            .createEl("h4", { text: "Basic Info" });
        new Setting(this.infoDetailEl).setName("Calendar Name").addText((t) => {
            t.setValue(this.calendar.name).onChange(
                (v) => (this.calendar.name = v)
            );
        });

        const descriptionEl = this.infoDetailEl.createDiv(
            "calendar-description"
        );
        descriptionEl.createEl("label", { text: "Calendar Description" });
        new TextAreaComponent(descriptionEl)
            .setPlaceholder("Calendar Description")
            .setValue(this.calendar.description)
            .onChange((v) => {
                this.calendar.description = v;
            });

        this.dateFieldEl = this.infoDetailEl.createDiv(
            "fantasy-calendar-date-fields"
        );
        this.buildDateFields();
    }
    tempCurrentDays = this.calendar.current.day;
    buildDateFields() {
        this.dateFieldEl.empty();

        if (this.tempCurrentDays == null && this.calendar.current.day) {
            this.tempCurrentDays = this.calendar.current.day;
        }

        if (
            this.tempCurrentDays != undefined &&
            this.calendar.current.month != undefined &&
            this.tempCurrentDays >
                this.calendar.static.months[this.calendar.current.month]?.length
        ) {
            this.tempCurrentDays =
                this.calendar.static.months[
                    this.calendar.current.month
                ]?.length;
        }
        const dayEl = this.dateFieldEl.createDiv("fantasy-calendar-date-field");
        dayEl.createEl("label", { text: "Day" });
        const day = new TextComponent(dayEl)
            .setPlaceholder("Day")
            .setValue(`${this.tempCurrentDays}`)
            .setDisabled(this.calendar.current.month == undefined)
            .onChange((v) => {
                if (
                    Number(v) < 1 ||
                    (Number(v) >
                        this.calendar.static.months[this.calendar.current.month]
                            ?.length ??
                        Infinity)
                ) {
                    new Notice(
                        `The current day must be between 1 and ${
                            this.calendar.static.months[
                                this.calendar.current.month
                            ].length
                        }`
                    );
                    this.tempCurrentDays = this.calendar.current.day;
                    this.buildDateFields();
                    return;
                }
                this.tempCurrentDays = Number(v);
            });
        day.inputEl.setAttr("type", "number");

        const monthEl = this.dateFieldEl.createDiv(
            "fantasy-calendar-date-field"
        );
        monthEl.createEl("label", { text: "Month" });
        new DropdownComponent(monthEl)
            .addOptions(
                Object.fromEntries([
                    ["select", "Select Month"],
                    ...this.calendar.static.months.map((month) => [
                        month.name,
                        month.name
                    ])
                ])
            )
            .setValue(
                this.calendar.current.month != undefined
                    ? this.calendar.static.months[this.calendar.current.month]
                          .name
                    : "select"
            )
            .onChange((v) => {
                if (v === "select") this.calendar.current.month = null;
                const index = this.calendar.static.months.find(
                    (m) => m.name == v
                );
                this.calendar.current.month =
                    this.calendar.static.months.indexOf(index);
            });

        const yearEl = this.dateFieldEl.createDiv(
            "fantasy-calendar-date-field"
        );
        yearEl.createEl("label", { text: "Year" });
        const year = new TextComponent(yearEl)
            .setPlaceholder("Year")
            .setValue(`${this.calendar.current.year}`)
            .onChange((v) => {
                this.calendar.current.year = Number(v);
            });
        year.inputEl.setAttr("type", "number");
    }

    buildWeekdays() {
        this.weekdayEl.empty();
        const weekday = new Weekdays({
            target: this.weekdayEl,
            props: {
                weekdays: this.week,
                firstWeekday: this.calendar.static.firstWeekDay,
                overflow: this.calendar.static.overflow
            }
        });

        weekday.$on("weekday-update", (e) => {
            this.calendar.static.weekdays = e.detail;

            if (
                !this.calendar.static.firstWeekDay &&
                this.calendar.static.weekdays.length
            ) {
                this.calendar.static.firstWeekDay = 0;
                weekday.$set({
                    firstWeekday: this.calendar.static.firstWeekDay
                });
            }

            this.checkCanSave();
        });
        weekday.$on("first-weekday-update", (e: CustomEvent<number>) => {
            this.calendar.static.firstWeekDay = e.detail;
        });
        weekday.$on("overflow-update", (e: CustomEvent<boolean>) => {
            this.calendar.static.overflow = e.detail;
            if (!this.calendar.static.overflow)
                this.calendar.static.firstWeekDay = 0;

            weekday.$set({
                firstWeekday: this.calendar.static.firstWeekDay
            });
        });
    }
    buildMonths() {
        this.monthEl.empty();
        const months = new Months({
            target: this.monthEl,
            props: {
                months: this.months
            }
        });

        months.$on("month-update", (e) => {
            this.calendar.static.months = e.detail;

            this.buildDateFields();
            this.checkCanSave();
        });
    }
    buildEvents() {
        this.eventEl.empty();
        this.eventsUI = new EventsUI({
            target: this.eventEl,
            props: {
                events: this.events,
                months: this.calendar.static.months,
                categories: this.calendar.categories
            }
        });
        this.eventsUI.$on("new-item", async (e: CustomEvent<Event>) => {
            const modal = new CreateEventModal(
                this.app,
                this.calendar,
                e.detail
            );
            modal.onClose = () => {
                if (!modal.saved) return;
                if (modal.editing) {
                    const index = this.calendar.events.indexOf(
                        this.calendar.events.find(
                            (e) => e.id === modal.event.id
                        )
                    );

                    this.calendar.events.splice(index, 1, { ...modal.event });
                } else {
                    this.calendar.events.push({ ...modal.event });
                }
                this.eventsUI.$set({ events: this.events });
                this.plugin.saveCalendar();
            };
            modal.open();
        });

        this.eventsUI.$on("edit-events", (e: CustomEvent<Event[]>) => {
            this.calendar.events = e.detail;
        });

        this.eventEl.setAttr(
            `style`,
            `--event-max-width: ${
                this.eventEl.getBoundingClientRect().width
            }px;`
        );
    }
    buildCategories() {
        this.categoryEl.empty();
        const category = new Categories({
            target: this.categoryEl,
            props: {
                categories: this.calendar.categories
            }
        });

        category.$on("update", (event: CustomEvent<EventCategory>) => {
            const existing = this.calendar.categories.find(
                (c) => c.id == event.detail.id
            );

            this.calendar.categories.splice(
                this.calendar.categories.indexOf(existing),
                1,
                event.detail
            );
            this.eventsUI.$set({
                categories: this.calendar.categories,
                events: this.events
            });
        });
        category.$on("delete", (event: CustomEvent<EventCategory>) => {
            this.calendar.categories.splice(
                this.calendar.categories.indexOf(event.detail),
                1
            );
            this.eventsUI.$set({
                categories: this.calendar.categories,
                events: this.events
            });
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
    }
    buildButtons() {
        this.buttonsEl.empty();

        new ButtonComponent(this.buttonsEl)
            .setCta()
            .setButtonText(this.editing ? "Save" : "Create")
            .onClick(() => {
                if (!this.canSave) {
                    this.checkCanSave();
                }
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
                this.calendar.current.day = this.tempCurrentDays;
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

export class CalendarPresetModal extends Modal {
    preset: Calendar;
    saved: boolean;
    async onOpen() {
        await this.display();
    }
    async display() {
        this.containerEl.addClass("fantasy-calendar-choose-preset");
        this.contentEl.empty();
        this.contentEl.createEl("h3", {
            text: "Choose a Preset Calendar"
        });

        const presetEl = this.contentEl.createDiv(
            "fantasy-calendar-preset-container"
        );

        for (const preset of PRESET_CALENDARS) {
            const button = new ButtonComponent(presetEl).onClick(() => {
                this.preset = preset;
                this.display();
            });
            if (this.preset == preset) button.setCta();
            button.buttonEl.createDiv({
                cls: "setting-item-name",
                text: preset.name
            });
            button.buttonEl.createDiv({
                cls: "setting-item-description",
                text: preset.description
            });
        }

        const buttonEl = this.contentEl.createDiv(
            "fantasy-calendar-confirm-buttons"
        );
        new ButtonComponent(buttonEl)
            .setButtonText("Apply")
            .onClick(() => {
                this.saved = true;
                this.close();
            })
            .setCta();
        new ExtraButtonComponent(buttonEl).setIcon("cross").onClick(() => {
            this.close();
        });
    }
}
