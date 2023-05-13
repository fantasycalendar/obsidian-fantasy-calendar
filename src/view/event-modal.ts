import { MarkdownRenderer } from "obsidian";
import type { FcEvent } from "src/@types";
import type FantasyCalendar from "src/main";
import { FantasyCalendarModal } from "src/settings/modals/modal";

export class ViewEventModal extends FantasyCalendarModal {
    constructor(public event: FcEvent, public plugin: FantasyCalendar) {
        super(plugin.app);
        this.containerEl.addClass("fantasy-calendar-view-event");
    }
    async display() {
        this.contentEl.empty();
        this.contentEl.createEl("h4", { text: this.event.name });

        await MarkdownRenderer.renderMarkdown(
            this.event.description,
            this.contentEl,
            this.event.note,
            null
        );
    }
    async onOpen() {
        await this.display();
    }
}
