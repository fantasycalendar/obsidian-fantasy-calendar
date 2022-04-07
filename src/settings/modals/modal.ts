import { App, Modal } from "obsidian";

export abstract class FantasyCalendarModal extends Modal {
    constructor(public app: App) {
        super(app);
        this.containerEl.addClass("fantasy-calendar-modal")
    }
}