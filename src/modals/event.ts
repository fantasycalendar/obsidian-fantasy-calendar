import {
    Modal,
    App,
    Setting,
    Notice,
    TextComponent,
    DropdownComponent,
    TextAreaComponent
} from "obsidian";
import type { Calendar, Event } from "../@types";
import { dateString, nanoid } from "../utils/functions";

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

        this.fieldsEl = this.dateEl.createDiv("event-date-fields");

        this.buildDateFields();

        this.stringEl = this.dateEl.createDiv(
            "event-date-string setting-item-description"
        );
        this.buildDateString();
    }
    buildDateString() {
        this.stringEl.empty();
        this.stringEl.createSpan({
            text: dateString(this.event, this.calendar.static.months)
        });
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

        console.log(
            Object.fromEntries([
                ["select", "Select Month"],
                ...this.calendar.static.months.map((month) => [
                    month.name,
                    month.name
                ])
            ])
        );

        const monthEl = this.fieldsEl.createDiv("event-date-field");
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

        new Setting(this.infoEl).setName("Event Category").addDropdown((d) => {
            const options = Object.fromEntries(
                this.calendar.categories.map((category) => {
                    return [category.id, category.name];
                })
            );

            d.addOptions(options)
                .setValue(options[this.event.category])
                .onChange((v) => (this.event.category = v));
        });
    }
    async onOpen() {
        await this.display();
    }
}
