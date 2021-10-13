import {
    Modal,
    App,
    Setting,
    Notice,
    TextComponent,
    DropdownComponent,
    TextAreaComponent,
    TFile
} from "obsidian";
import type { Calendar, Event } from "../../@types";

import { dateString, nanoid } from "../../utils/functions";

import PathSuggestionModal from "../../suggester/path";
import { confirmWithModal } from "./confirm";

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
        note: null,
        category: null
    };
    editing: boolean;
    infoEl: HTMLDivElement;
    dateEl: HTMLElement;
    monthEl: HTMLDivElement;
    dayEl: HTMLDivElement;
    yearEl: HTMLDivElement;
    fieldsEl: HTMLDivElement;
    stringEl: HTMLDivElement;
    constructor(
        app: App,
        public calendar: Calendar,
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

        this.fieldsEl = this.dateEl.createDiv("fantasy-calendar-date-fields");

        this.buildDateFields();

        this.stringEl = this.dateEl.createDiv(
            "event-date-string setting-item-description"
        );
        this.buildDateString();
    }
    buildDateString() {
        this.stringEl.empty();
        this.stringEl.createSpan({
            text: dateString(this.event.date, this.calendar.static.months)
        });
    }
    buildDateFields() {
        this.fieldsEl.empty();
        const dayEl = this.fieldsEl.createDiv("fantasy-calendar-date-field");
        dayEl.createEl("label", { text: "Day" });
        const day = new TextComponent(dayEl)
            .setPlaceholder("Day")
            .setValue(`${this.event.date.day}`)
            .onChange((v) => {
                this.event.date.day = Number(v);
            });
        day.inputEl.setAttr("type", "number");

        const monthEl = this.fieldsEl.createDiv("fantasy-calendar-date-field");
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
                this.event.date.month != undefined
                    ? this.calendar.static.months[this.event.date.month].name
                    : "select"
            )
            .onChange((v) => {
                if (v === "select") this.event.date.month = null;
                const index = this.calendar.static.months.find(
                    (m) => m.name == v
                );
                this.event.date.month =
                    this.calendar.static.months.indexOf(index);
            });

        const yearEl = this.fieldsEl.createDiv("fantasy-calendar-date-field");
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
            .addText((text) => {
                let files = this.app.vault.getFiles();
                text.setPlaceholder("Path").setValue(this.event.note);
                const modal = new PathSuggestionModal(this.app, text, [
                    ...files
                ]);

                modal.onClose = async () => {
                    text.inputEl.blur();

                    this.event.note = text.inputEl.value;

                    this.tryParse(this.event.note, modal.file);
                };
            });

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

        new Setting(this.infoEl).setName("Event Category").addDropdown((d) => {
            const options = Object.fromEntries(
                this.calendar.categories.map((category) => {
                    return [category.id, category.name];
                })
            );

            d.addOptions(options)
                .setValue(this.event.category)
                .onChange((v) => (this.event.category = v));
        });
    }
    async tryParse(note: string, file: TFile) {
        if (
            this.event.name ||
            this.event.description ||
            this.event.date.day ||
            this.event.date.month ||
            this.event.date.year ||
            this.event.category
        ) {
            if (
                !(await confirmWithModal(
                    this.app,
                    "Parse frontmatter and overwrite this event's data?"
                ))
            )
                return;
        }
        this.event.name = note;
        const cache = this.app.metadataCache.getFileCache(file);

        const { frontmatter } = cache;
        if (frontmatter) {
            if ("fc-date" in frontmatter) {
                const { day, month, year } = frontmatter["fc-date"];
                if (day) this.event.date.day = day;
                if (month) {
                    if (typeof month === "string") {
                        const indexer =
                            this.calendar.static.months?.find(
                                (m) => m.name == month
                            ) ?? this.calendar.static.months?.[0];
                        this.event.date.month =
                            this.calendar.static.months?.indexOf(indexer);
                    }
                    if (typeof month == "number") {
                        this.event.date.month = month - 1;
                    }
                }
                if (year) this.event.date.year = year;
            }
            if ("fc-category" in frontmatter) {
                if (
                    !this.calendar.categories.find(
                        (c) => c.name === frontmatter["fc-category"]
                    )
                ) {
                    this.calendar.categories.push({
                        name: frontmatter["fantasy-category"],
                        color: "#808080",
                        id: nanoid(6)
                    });
                }
                this.event.category = this.calendar.categories.find(
                    (c) => c.name === frontmatter["fc-category"]
                )?.id;
            }
        }

        await this.display();
    }
    async onOpen() {
        await this.display();
    }
}
