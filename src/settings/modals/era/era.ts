import copy from "fast-copy";
import FantasyCalendar from "src/main";
import type { Calendar, Era } from "src/@types";
import { nanoid } from "src/utils/functions";
import { FantasyCalendarModal } from "../modal";
import { Notice, Setting } from "obsidian";

export class CreateEraModal extends FantasyCalendarModal {
    saved = false;
    era: Era = {
        name: null,
        id: nanoid(6),
        format: null,
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
            t.setValue(this.era.name).onChange((v) => {
                this.era.name = v;
            });
        });
        const advanced = this.contentEl.createEl("details", {
            cls: "fantasy-calendar-nested-settings",
            attr: {}
        });
        const summary = advanced.createEl("summary");
        new Setting(summary).setHeading().setName("Advanced");
        summary.createDiv("collapser").createDiv("handle");
        new Setting(this.contentEl)
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
                })
            )
            .addText((t) => {
                t.setValue(this.era.format).onChange((v) => {
                    this.era.format = v;
                });
            });

        new Setting(advanced).setName("Restart Year").setDesc("");

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

    async onOpen() {
        await this.display();
    }
}
