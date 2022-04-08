import copy from "fast-copy";
import FantasyCalendar from "src/main";
import type { Calendar, Era } from "src/@types";
import { nanoid } from "src/utils/functions";
import { FantasyCalendarModal } from "../modal";
import { Notice, Setting } from "obsidian";

import CurrentDate from "../../creator/Containers/CurrentDate.svelte";

export class CreateEraModal extends FantasyCalendarModal {
    saved = false;
    era: Era = {
        name: null,
        id: nanoid(6),
        format: "Year {{year}} - {{era_name}}",
        restart: false,
        endsYear: false,
        event: false,
        start: null
    };
    editing = false;
    constructor(
        public plugin: FantasyCalendar,
        public calendar: Calendar,
        era?: Era
    ) {
        super(plugin.app);
        if (era) {
            this.era = copy(era);
            this.editing = true;
        }
        this.containerEl.addClass("fantasy-calendar-create-era");
    }

    async display() {
        this.contentEl.empty();
        this.titleEl.setText(this.editing ? "Edit Era" : "New Era");
        new Setting(this.contentEl).setName("Name").addText((t) => {
            t.setValue(this.era.name ?? "Era").onChange((v) => {
                this.era.name = v;
            });
        });

        new CurrentDate({
            target: this.contentEl.createDiv(),
            props: {
                calendar: this.calendar,
                date: this.era.start
            }
        });

        const advanced = this.contentEl.createEl("details", {
            cls: "fantasy-calendar-nested-settings",
            attr: {}
        });
        const summary = advanced.createEl("summary");
        summary.createDiv("collapser").createDiv("handle");

        new Setting(summary).setHeading().setName("Advanced");
        const formta = new Setting(advanced)
            .setName("Format")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Change how the era is displayed. See "
                    });
                    e.createEl("a", {
                        text: "here",
                        href: "https://helpdocs.fantasy-calendar.com/topic/eras/"
                    });
                    e.createSpan({ text: " for more information." });
                    e.createEl("br");
                    e.createSpan({ text: "Current format: " });
                })
            )
            .addText((t) => {
                t.setValue(this.era.format).onChange((v) => {
                    this.era.format = v;
                });
            });
        new Setting(advanced)
            .setName("Restart Year Count")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Restart the displayed year count from zero."
                    });
                })
            )
            .addToggle((t) =>
                t
                    .setValue(this.era.restart)
                    .onChange((v) => (this.era.restart = v))
            );
        new Setting(advanced)
            .setName("Ends Year Prematurely")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "The calendar year will end at the start of a new era."
                    });
                })
            )
            .addToggle((t) =>
                t
                    .setValue(this.era.endsYear)
                    .onChange((v) => (this.era.endsYear = v))
            );

        this.buildEventSettings(advanced.createDiv("setting-item"));

        new Setting(this.contentEl)
            .addButton((b) => {
                b.setButtonText("Save")
                    .setCta()
                    .onClick(async () => {
                        if (!this.era.name?.length) {
                            new Notice("The event must have a name.");
                            return;
                        }

                        this.close();
                    });
            })
            .addExtraButton((b) => {
                b.setIcon("cross")
                    .setTooltip("Cancel")
                    .onClick(() => this.close());
            });
    }
    buildEventSettings(eventEl: HTMLDivElement) {
        eventEl.empty();
        const advanced = eventEl.createDiv("era-event");
        new Setting(advanced)
            .setName("Show as Event")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "The era will appear on its starting date as an event."
                    });
                })
            )
            .addToggle((t) =>
                t.setValue(this.era.event).onChange((v) => {
                    this.era.event = v;
                    if (!v) {
                        this.era.eventCategory = null;
                        this.era.eventDescription = null;
                    }
                    this.buildEventSettings(eventEl);
                })
            );
        if (this.era.event) {
            new Setting(advanced)
                .setName("Event Category")
                .addDropdown((d) => d);
            new Setting(advanced)
                .setName("Event Description")
                .addTextArea((t) => t);
        }
    }

    async onOpen() {
        await this.display();
    }
}
