import {
    addIcon,
    ButtonComponent,
    DropdownComponent,
    ExtraButtonComponent,
    Modal,
    normalizePath,
    Notice,
    PluginSettingTab,
    setIcon,
    Setting,
    TextAreaComponent,
    TextComponent,
    TFolder
} from "obsidian";

import copy from "fast-copy";

import { DEFAULT_CALENDAR } from "../main";
import type FantasyCalendar from "../main";
import Importer from "./import/importer";
import { PRESET_CALENDARS } from "../utils/presets";

import CalendarCreator from "./creator/Creator.svelte";

import Weekdays from "./ui/Weekdays.svelte";
import Months from "./ui/Months.svelte";
import EventsUI from "./ui/Events.svelte";
import Categories from "./ui/Categories.svelte";
import Year from "./ui/Year.svelte";

import "./settings.css";
import { nanoid } from "src/utils/functions";
import type {
    Calendar,
    Event,
    EventCategory,
    LeapDay,
    Moon,
    Year as YearType
} from "src/@types";

import { CreateEventModal } from "./modals/event";
import { confirmWithModal } from "./modals/confirm";

import MoonUI from "./ui/Moons.svelte";
import LeapDays from "./ui/LeapDays.svelte";
import { CreateMoonModal } from "src/settings/modals/moons";
import { CreateLeapDayModal } from "./modals/leapday";
import { FolderSuggestionModal } from "src/suggester/folder";

export enum Recurring {
    none = "None",
    monthly = "Monthly",
    yearly = "Yearly"
}

declare module "obsidian" {
    interface App {
        internalPlugins: {
            getPluginById(id: "daily-notes"): {
                _loaded: boolean;
                instance: {
                    options: {
                        format: string;
                    };
                };
            };
        };
    }
}

addIcon(
    "fantasy-calendar-grip",
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grip-lines" class="svg-inline--fa fa-grip-lines fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M496 288H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-128H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z"/></svg>`
);

addIcon(
    "fantasy-calendar-warning",
    `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>`
);

export default class FantasyCalendarSettings extends PluginSettingTab {
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

        this.buildInfo(
            this.containerEl.createDiv("fantasy-calendar-nested-settings")
        );
        this.buildCalendars(
            this.containerEl.createEl("details", {
                cls: "fantasy-calendar-nested-settings",
                attr: {
                    ...(this.data.settingsToggleState.calendars
                        ? { open: `open` }
                        : {})
                }
            })
        );
        this.buildEvents(
            this.containerEl.createEl("details", {
                cls: "fantasy-calendar-nested-settings",
                attr: {
                    ...(this.data.settingsToggleState.events
                        ? { open: `open` }
                        : {})
                }
            })
        );
    }
    buildInfo(containerEl: HTMLElement) {
        containerEl.empty();

        new Setting(containerEl)
            .setName(
                createFragment((e) => {
                    const span = e.createSpan("fantasy-calendar-warning");
                    setIcon(
                        span.createSpan("fantasy-calendar-warning"),
                        "fantasy-calendar-warning"
                    );
                    span.createSpan({ text: "Default Config Directory" });
                })
            )
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Please back up your data before changing this setting. Hidden directories must be manually entered."
                    });
                    e.createEl("br");
                    e.createSpan({
                        text: `Current directory: `
                    });
                    const configDirectory =
                        this.data.configDirectory ?? this.app.vault.configDir;
                    e.createEl("code", {
                        text: configDirectory
                    });
                })
            )
            .addText(async (text) => {
                let folders = this.app.vault
                    .getAllLoadedFiles()
                    .filter((f) => f instanceof TFolder);

                text.setPlaceholder(
                    this.data.configDirectory ?? this.app.vault.configDir
                );
                const modal = new FolderSuggestionModal(this.app, text, [
                    ...(folders as TFolder[])
                ]);

                modal.onClose = async () => {
                    if (!text.inputEl.value) {
                        this.data.configDirectory = null;
                    } else {
                        const exists = await this.app.vault.adapter.exists(
                            text.inputEl.value
                        );

                        if (!exists) {
                            this.data.configDirectory = text.inputEl.value;
                            await this.plugin.saveSettings();
                        }
                    }
                };

                text.inputEl.onblur = async () => {
                    if (!text.inputEl.value) {
                        return;
                    }
                    const exists = await this.app.vault.adapter.exists(
                        text.inputEl.value
                    );

                    this.data.configDirectory = text.inputEl.value;

                    await this.plugin.saveSettings();
                    this.display();
                };
            })
            .addExtraButton((b) => {
                b.setTooltip("Reset to Default")
                    .setIcon("reset")
                    .onClick(async () => {
                        this.data.configDirectory = null;
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });
    }
    buildCalendars(containerEl: HTMLDetailsElement) {
        containerEl.empty();
        containerEl.ontoggle = () => {
            this.data.settingsToggleState.calendars = containerEl.open;
        };
        const summary = containerEl.createEl("summary");
        new Setting(summary).setHeading().setName("Calendar Management");

        summary.createDiv("collapser").createDiv("handle");

        new Setting(containerEl)
            .setName("Default Calendar")
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
        new Setting(containerEl)
            .setName("Import Calendar")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Import calendar from "
                    });
                    e.createEl("a", {
                        href: "https://app.fantasy-calendar.com",
                        text: "Fantasy Calendar",
                        cls: "external-link"
                    });
                })
            )
            .addButton((b) => {
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
                        this.showCalendars(existing);
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
                b.setButtonText("Choose Files");
                b.buttonEl.addClass("calendar-file-upload");
                b.buttonEl.appendChild(input);
                b.onClick(() => input.click());
            });

        new Setting(containerEl)
            .setName("Create New Calendar")
            .addButton((button: ButtonComponent) =>
                button
                    .setTooltip("Launch Calendar Creator")
                    .setIcon("plus-with-circle")
                    .onClick(() => {
                        this.launchCalendarCreator();
                        /* const modal = new CreateCalendarModal(this.plugin);
                        modal.onClose = async () => {
                            if (!modal.saved) return;
                            const calendar = copy(modal.calendar);
                            if (!calendar.current.year) {
                                calendar.current.year = 1;
                            }
                            await this.plugin.addNewCalendar(calendar);

                            this.showCalendars(existing);
                        };
                        modal.open(); */
                    })
            );

        const existing = containerEl.createDiv("existing-calendars");

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
                            if (!modal.saved) {
                                this.showCalendars(element);
                                return;
                            }
                            this.data.calendars.splice(
                                this.data.calendars.indexOf(calendar),
                                1,
                                copy(modal.calendar)
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

                        if (calendar.name == this.plugin.data.defaultCalendar) {
                            this.display();
                        } else {
                            this.showCalendars(element);
                        }
                    });
                });
        }
    }

    buildEvents(containerEl: HTMLDetailsElement) {
        containerEl.empty();
        containerEl.ontoggle = () => {
            this.data.settingsToggleState.events = containerEl.open;
        };
        const summary = containerEl.createEl("summary");
        new Setting(summary).setHeading().setName("Events");

        summary.createDiv("collapser").createDiv("handle");

        new Setting(containerEl)
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
        new Setting(containerEl)
            .setName("Automatically Parse for Events")
            .setDesc(
                "The plugin will automatically parse files in the vault for events."
            )
            .addToggle((t) => {
                t.setValue(this.data.autoParse).onChange((v) => {
                    this.data.autoParse = v;
                    this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName("Events Folder")
            .setDesc("The plugin will only watch for changes in this folder.")
            .addText((text) => {
                let folders = this.app.vault
                    .getAllLoadedFiles()
                    .filter((f) => f instanceof TFolder);

                text.setPlaceholder(this.plugin.data.path ?? "/");
                const modal = new FolderSuggestionModal(this.app, text, [
                    ...(folders as TFolder[])
                ]);

                modal.onClose = async () => {
                    const v = text.inputEl.value?.trim()
                        ? text.inputEl.value.trim()
                        : "/";
                    this.plugin.data.path = normalizePath(v);
                };

                text.inputEl.onblur = async () => {
                    const v = text.inputEl.value?.trim()
                        ? text.inputEl.value.trim()
                        : "/";
                    this.plugin.data.path = normalizePath(v);
                };
            });
        new Setting(containerEl)
            .setName("Parse Note Titles for Event Dates")
            .setDesc("The plugin will parse note titles for event dates.")
            .addToggle((t) => {
                t.setValue(this.data.parseDates).onChange((v) => {
                    this.data.parseDates = v;
                    this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName("Date Format")
            .setClass(this.data.dailyNotes ? "daily-notes" : "no-daily-notes")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Event dates will be parsed using this format."
                    });
                    e.createSpan({ text: "Only the " });
                    e.createEl("code", { text: "Y" });
                    e.createSpan({
                        text: ", "
                    });
                    e.createEl("code", { text: "M" });
                    e.createSpan({
                        text: ", and "
                    });
                    e.createEl("code", { text: "D" });
                    e.createEl("a", {
                        text: "tokens",
                        href: "https://momentjs.com/docs/#/displaying/format/",
                        cls: "external-link"
                    });
                    e.createSpan({
                        text: " are supported."
                    });
                    if (
                        ["Y", "M", "D"].some(
                            (token) => !this.data.dateFormat.includes(token)
                        )
                    ) {
                        e.createEl("br");
                        const span = e.createSpan({
                            cls: "fantasy-calendar-warning date-format"
                        });
                        setIcon(
                            span.createSpan("fantasy-calendar-warning"),
                            "fantasy-calendar-warning"
                        );
                        let missing = ["Y", "M", "D"].filter(
                            (token) => !this.data.dateFormat.includes(token)
                        );
                        span.createSpan({
                            text: ` Date format is missing: ${missing
                                .join(", ")
                                .replace(/, ([^,]*)$/, " and $1")}`
                        });
                    }
                })
            )
            .addText((t) => {
                t.setDisabled(this.data.dailyNotes)
                    .setValue(this.plugin.format)
                    .onChange((v) => {
                        this.data.dateFormat = v;
                        this.plugin.saveSettings();
                    });
                t.inputEl.onblur = () => this.buildEvents(containerEl);
            })
            .addExtraButton((b) => {
                if (!this.plugin.canUseDailyNotes) {
                    b.extraSettingsEl.detach();
                    return;
                }
                if (this.data.dailyNotes) {
                    b.setIcon("checkmark")
                        .setTooltip("Unlink from Daily Notes")
                        .onClick(() => {
                            this.data.dailyNotes = false;
                            this.buildEvents(containerEl);
                        });
                } else {
                    b.setIcon("sync")
                        .setTooltip("Link with Daily Notes")
                        .onClick(() => {
                            this.data.dailyNotes = true;
                            this.buildEvents(containerEl);
                        });
                }
            });

        new Setting(containerEl)
            .setName("Support Timelines Events")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Support <span> elements used by the "
                    });
                    e.createEl("a", {
                        text: "Obsidian Timelines",
                        href: "obsidian://show-plugin?id=obsidian-timelines"
                    });
                    e.createSpan({
                        text: " plugin (by Darakah)."
                    });
                })
            )
            .addToggle((t) => {
                t.setValue(this.data.supportTimelines).onChange((v) => {
                    this.data.supportTimelines = v;
                    this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("Default tag marking pages containing Timelines data")
            .setDesc(
                "Tag to specify which notes to include in created timelines e.g. timeline to use the #timeline tag"
            )
            .addText((text) =>
                text
                    .setPlaceholder(this.data.timelineTag)
                    .setValue(this.data.timelineTag.replace("#", ""))
                    .setDisabled(this.plugin.syncTimelines)
                    .onChange((v) => {
                        this.data.timelineTag = v.startsWith("#") ? v : `#${v}`;
                        this.plugin.saveSettings();
                    })
            )
            .addExtraButton((b) => {
                if (!this.plugin.canUseTimelines) {
                    this.data.syncTimelines = false;
                    b.extraSettingsEl.detach();
                    return;
                }
                if (this.data.syncTimelines) {
                    b.setIcon("checkmark")
                        .setTooltip("Unsync from Timelines Plugin")
                        .onClick(async () => {
                            this.data.syncTimelines = false;
                            await this.plugin.saveSettings();
                            this.buildEvents(containerEl);
                        });
                } else {
                    b.setIcon("sync")
                        .setTooltip("Sync with Timelines Plugin")
                        .onClick(async () => {
                            this.data.syncTimelines = true;
                            this.data.timelineTag =
                                this.plugin.app.plugins.getPlugin(
                                    "obsidian-timelines"
                                ).settings.timelineTag;
                            await this.plugin.saveSettings();
                            this.buildEvents(containerEl);
                        });
                }
            });
    }

    launchCalendarCreator(calendar?: Calendar) {
        this.containerEl.empty();
        const $app = new CalendarCreator({
            target: this.containerEl,
            props: {
                calendar,
                plugin: this.plugin
            }
        });
        $app.$on("flown", () => {
            /*  */
        });
        $app.$on("exit", () => {
            this.display();
        });
    }
}

class CreateCalendarModal extends Modal {
    calendar: Calendar = copy(DEFAULT_CALENDAR);
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
    moonEl: HTMLDivElement;
    leapdayEl: any;
    yearEl: HTMLDivElement;
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
            this.calendar = copy(existing);
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
                            if (modal.preset?.name == "Gregorian Calendar") {
                                const today = new Date();

                                modal.preset.current = {
                                    year: today.getFullYear(),
                                    month: today.getMonth(),
                                    day: today.getDate()
                                };
                            }
                            this.calendar = {
                                ...modal.preset,
                                id: this.calendar.id
                            };
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
        this.monthEl = this.uiEl.createDiv("fantasy-calendar-element");
        this.buildMonths();
        this.yearEl = this.uiEl.createDiv("fantasy-calendar-element");
        this.buildYear();
        this.leapdayEl = this.uiEl.createDiv("fantasy-calendar-element");
        this.buildLeapDays();
        this.eventEl = this.uiEl.createDiv("fantasy-calendar-element");
        this.buildEvents();
        this.categoryEl = this.uiEl.createDiv("fantasy-calendar-element");
        this.buildCategories();
        this.moonEl = this.uiEl.createDiv("fantasy-calendar-element");
        this.buildMoons();
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

        new Setting(this.infoDetailEl)
            .setName("Display Day Number")
            .setDesc("Display the day of the year.")
            .addToggle((t) => {
                t.setValue(this.static.displayDayNumber).onChange((v) => {
                    this.static.displayDayNumber = v;
                    this.buildInfo();
                });
            });

        new Setting(this.infoDetailEl)
            .setName("Auto Increment Day")
            .setDesc("Automatically increment the calendar day every real day.")
            .addToggle((t) => {
                t.setValue(this.static.incrementDay).onChange((v) => {
                    this.static.incrementDay = v;
                });
            });

        this.dateFieldEl = this.infoDetailEl.createDiv();
        this.buildDateFields();
    }
    tempCurrentDays = this.calendar.current.day;
    buildDateFields() {
        this.dateFieldEl.empty();

        new Setting(this.dateFieldEl)
            .setClass("fantasy-calendar-date-fields-heading")
            .setHeading()
            .setName("Current Date");
        const dateFieldEl = this.dateFieldEl.createDiv(
            "fantasy-calendar-date-fields"
        );
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
        const dayEl = dateFieldEl.createDiv("fantasy-calendar-date-field");
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

        const monthEl = dateFieldEl.createDiv("fantasy-calendar-date-field");
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
                this.buildDateFields();
            });

        const yearEl = dateFieldEl.createDiv("fantasy-calendar-date-field");
        yearEl.createEl("label", { text: "Year" });
        if (this.calendar.static.useCustomYears) {
            const yearDrop = new DropdownComponent(yearEl);
            (this.calendar.static.years ?? []).forEach((year) => {
                yearDrop.addOption(year.id, year.name);
            });
            if (
                this.calendar.current.year > this.calendar.static.years?.length
            ) {
                this.calendar.current.year = this.calendar.static.years
                    ? this.calendar.static.years.length
                    : null;
            }
            yearDrop
                .setValue(
                    this.calendar.static.years?.[this.calendar.current.year - 1]
                        ?.id
                )
                .onChange((v) => {
                    this.calendar.current.year =
                        this.calendar.static.years.findIndex((y) => y.id == v) +
                        1;
                });
        } else {
            const year = new TextComponent(yearEl)
                .setPlaceholder("Year")
                .setValue(`${this.calendar.current.year}`)
                .onChange((v) => {
                    this.calendar.current.year = Number(v);
                });
            year.inputEl.setAttr("type", "number");
        }
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
    buildYear() {
        this.yearEl.empty();
        const years = new Year({
            target: this.yearEl,
            props: {
                useCustomYears: this.static.useCustomYears,
                years: this.static.years,
                app: this.app
            }
        });
        years.$on("years-update", (e: CustomEvent<YearType[]>) => {
            this.calendar.static.years = e.detail;
            this.buildDateFields();
            this.buildEvents();
        });
        years.$on("use-custom-update", (e: CustomEvent<boolean>) => {
            this.calendar.static.useCustomYears = e.detail;
            this.buildDateFields();
            this.buildEvents();
        });
    }
    buildLeapDays() {
        this.leapdayEl.empty();
        const leapdayUI = new LeapDays({
            target: this.leapdayEl,
            props: {
                leapdays: this.static.leapDays
            }
        });

        leapdayUI.$on("new-item", async (e: CustomEvent<LeapDay>) => {
            const modal = new CreateLeapDayModal(
                this.app,
                this.calendar,
                e.detail
            );
            modal.onClose = () => {
                if (!modal.saved) return;
                if (modal.editing) {
                    const index = this.calendar.static.moons.indexOf(
                        this.calendar.static.moons.find(
                            (e) => e.id === modal.leapday.id
                        )
                    );

                    this.calendar.static.leapDays.splice(index, 1, {
                        ...modal.leapday
                    });
                } else {
                    this.calendar.static.leapDays.push({ ...modal.leapday });
                }
                leapdayUI.$set({ leapdays: this.calendar.static.leapDays });
                this.plugin.saveCalendar();
            };
            modal.open();
        });

        leapdayUI.$on("edit-leapdays", (e: CustomEvent<LeapDay[]>) => {
            this.calendar.static.leapDays = e.detail;
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

        category.$on("new", (event: CustomEvent<EventCategory>) => {
            this.calendar.categories.push(event.detail);
            this.eventsUI.$set({
                categories: this.calendar.categories
            });
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

    buildMoons() {
        this.moonEl.empty();
        this.static.displayMoons = this.static.displayMoons ?? true;
        const moonsUI = new MoonUI({
            target: this.moonEl,
            props: {
                moons: this.static.moons,
                displayMoons: this.static.displayMoons
            }
        });
        moonsUI.$on("display-toggle", (e: CustomEvent<boolean>) => {
            this.static.displayMoons = e.detail;
            moonsUI.$set({ displayMoons: this.static.displayMoons });
        });
        moonsUI.$on("new-item", async (e: CustomEvent<Moon>) => {
            const modal = new CreateMoonModal(
                this.app,
                this.calendar,
                e.detail
            );
            modal.onClose = () => {
                if (!modal.saved) return;
                if (modal.editing) {
                    const index = this.calendar.static.moons.indexOf(
                        this.calendar.static.moons.find(
                            (e) => e.id === modal.moon.id
                        )
                    );

                    this.calendar.static.moons.splice(index, 1, {
                        ...modal.moon
                    });
                } else {
                    this.calendar.static.moons.push({ ...modal.moon });
                }
                moonsUI.$set({ moons: this.calendar.static.moons });
                this.plugin.saveCalendar();
            };
            modal.open();
        });

        moonsUI.$on("edit-moons", (e: CustomEvent<Moon[]>) => {
            this.calendar.static.moons = e.detail;
        });
    }
    checkCanSave() {
        if (
            this.months?.length &&
            this.months?.every((m) => m.name?.length) &&
            this.months?.every((m) => m.length > 0) &&
            this.week?.length &&
            this.week?.every((d) => d.name?.length) &&
            this.calendar.name?.length &&
            this.calendar.static.firstWeekDay <
                (this.week?.length ?? Infinity) &&
            (!this.calendar.static.useCustomYears ||
                (this.calendar.static.useCustomYears &&
                    this.calendar.static.years?.length &&
                    this.calendar.static.years.every((y) => y.name?.length)))
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
                        this.calendar.static.useCustomYears &&
                        !this.calendar.static.years?.length
                    ) {
                        new Notice("Custom years must be defined.");
                    } else if (
                        this.calendar.static.useCustomYears &&
                        !this.calendar.static.years.every((y) => y.name?.length)
                    ) {
                        new Notice("Each custom year must be named.");
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
                this.preset = copy(this.preset);
                this.close();
            })
            .setCta();
        new ExtraButtonComponent(buttonEl).setIcon("cross").onClick(() => {
            this.close();
        });
    }
}
