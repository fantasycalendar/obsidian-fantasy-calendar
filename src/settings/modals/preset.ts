import copy from "fast-copy";
import { Modal, ButtonComponent, ExtraButtonComponent } from "obsidian";
import type { Calendar } from "src/@types";
import { nanoid } from "src/utils/functions";
import { PRESET_CALENDARS } from "src/utils/presets";
import { FantasyCalendarModal } from "./modal";

export class CalendarPresetModal extends FantasyCalendarModal {
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
                this.preset.id = nanoid(6);
                this.close();
            })
            .setCta();
        new ExtraButtonComponent(buttonEl).setIcon("cross").onClick(() => {
            this.close();
        });
    }
}
