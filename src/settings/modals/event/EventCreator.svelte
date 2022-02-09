<script lang="ts">
    import type { Calendar, Event } from "src/@types";
    import type FantasyCalendar from "src/main";

    import { TextComponent, TFile } from "obsidian";
    import PathSuggestionModal from "src/suggester/path";

    export let event: Event;
    export let calendar: Calendar;
    export let plugin: FantasyCalendar;

    const file = (node: HTMLElement) => {
        const text = new TextComponent(node);
        let files = plugin.app.vault.getFiles();
        text.setPlaceholder("Path");
        if (event.note) {
            const note = plugin.app.vault.getAbstractFileByPath(
                this.event.note
            );
            if (note && note instanceof TFile) {
                text.setValue(note.basename);
            }
        }

        const modal = new PathSuggestionModal(plugin.app, text, [...files]);

        modal.onClose = async () => {
            text.inputEl.blur();

            this.event.note = modal.file.path;

            this.tryParse(modal.file);
        };
    };
</script>

<div class="event-info">
    <div class="setting-item">
        <div class="setting-item-info">
            <div class="setting-item-name">Note</div>
            <div class="setting-item-description">
                Link the event to a note.
            </div>
        </div>
        <div class="setting-item-control" use:file />
    </div>
    <div class="setting-item">
        <div class="setting-item-info">
            <div class="setting-item-name">Event Name</div>
            <div class="setting-item-description" />
        </div>
        <div class="setting-item-control">
            <input type="text" spellcheck="false" placeholder="Event Name" />
        </div>
    </div>
    <div class="event-description">
        <label>Event Description</label><textarea
            spellcheck="false"
            placeholder="Event Description"
        />
    </div>
    <div class="setting-item">
        <div class="setting-item-info">
            <div class="setting-item-name">Event Category</div>
            <div class="setting-item-description" />
        </div>
        <div class="setting-item-control">
            <select class="dropdown" />
        </div>
    </div>
</div>
