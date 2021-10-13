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
import type { Calendar, Event, Moon } from "../@types";

import { dateString, nanoid } from "../utils/functions";

import PathSuggestionModal from "../suggester/path";
import { confirmWithModal } from "./confirm";

export class CreateMoonModal extends Modal {
    saved = false;
    moon: Moon = {
        name: null,
        cycle: null,
        offset: null,
        faceColor: "#fff",
        shadowColor: "#000",
        id: nanoid(6)
    };
    editing: boolean;
    infoEl: HTMLDivElement;
    constructor(app: App, public calendar: Calendar, moon?: Moon) {
        super(app);
        if (moon) {
            this.moon = { ...moon };
            this.editing = true;
        }
        this.containerEl.addClass("fantasy-calendar-create-moon");
    }

    async display() {
        this.contentEl.empty();
        this.contentEl.createEl("h3", {
            text: this.editing ? "Edit Moon" : "New Moon"
        });

        this.infoEl = this.contentEl.createDiv("moon-info");
        this.buildInfo();

        new Setting(this.contentEl)
            .addButton((b) => {
                b.setButtonText("Save")
                    .setCta()
                    .onClick(() => {
                        if (!this.moon.name?.length) {
                            new Notice("The moon must have a name.");
                            return;
                        }
                        if (!this.moon.cycle) {
                            new Notice("The moon must have a positive cycle.");
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
    buildInfo() {
        this.infoEl.empty();

        new Setting(this.infoEl).setName("Name").addText((t) => {
            t.setValue(this.moon.name).onChange((v) => {
                this.moon.name = v;
            });
        });
        new Setting(this.infoEl)
            .setName("Cycle")
            .setDesc(
                "How many days it takes for the moon to complete a full cycle."
            )
            .addText((t) => {
                t.inputEl.setAttr("type", "number");
                t.setValue(`${this.moon.cycle}`).onChange((v) => {
                    if (isNaN(Number(v))) return;
                    this.moon.cycle = Number(v);
                });
            });
        new Setting(this.infoEl)
            .setName("Offset")
            .setDesc("Shift the starting moon phase by a number of days.")
            .addText((t) => {
                t.inputEl.setAttr("type", "number");
                t.setValue(`${this.moon.offset}`).onChange((v) => {
                    if (isNaN(Number(v))) return;
                    this.moon.offset = Number(v);
                });
            });

        new Setting(this.infoEl).setName("Face Color").addText((t) => {
            t.inputEl.setAttr("type", "color");
            t.setValue(this.moon.faceColor).onChange((v) => {
                this.moon.faceColor = v;
            });
        });

        new Setting(this.infoEl).setName("Shadow Color").addText((t) => {
            t.inputEl.setAttr("type", "color");
            t.setValue(this.moon.shadowColor).onChange((v) => {
                this.moon.shadowColor = v;
            });
        });
    }
    async onOpen() {
        await this.display();
    }
}
