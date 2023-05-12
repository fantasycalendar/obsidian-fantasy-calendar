<script lang="ts">
    import type { Calendar, FcEvent } from "src/@types";
    import type FantasyCalendar from "src/main";

    import { TextComponent, TFile } from "obsidian";
    import PathSuggestionModal from "src/suggester/path";
    import { nanoid } from "src/utils/functions";

    export let event: FcEvent;
    export let calendar: Calendar;
    export let plugin: FantasyCalendar;

    const file = (node: HTMLElement) => {
        const text = new TextComponent(node);
        let files = plugin.app.vault.getFiles();
        text.setPlaceholder("Path");
        if (event.note) {
            const note = plugin.app.vault.getAbstractFileByPath(event.note);
            if (note && note instanceof TFile) {
                text.setValue(note.basename);
            }
        }

        const modal = new PathSuggestionModal(plugin.app, text, [...files]);

        modal.onClose = async () => {
            text.inputEl.blur();

            event.note = modal.file.path;

            tryParse(modal.file);
        };
    };
    const tryParse = async (file: TFile) => {
        event.name = file.basename;
        const cache = plugin.app.metadataCache.getFileCache(file);

        const { frontmatter } = cache;
        if (frontmatter) {
            if ("fc-date" in frontmatter) {
                const { day, month, year } = frontmatter["fc-date"];
                if (day) event.date.day = day;
                if (month) {
                    if (typeof month === "string") {
                        const indexer =
                            calendar.static.months?.find(
                                (m) => m.name == month
                            ) ?? this.calendar.static.months?.[0];
                        event.date.month =
                            calendar.static.months?.indexOf(indexer);
                    }
                    if (typeof month == "number") {
                        event.date.month = month - 1;
                    }
                }
                if (year) event.date.year = year;
            }
            if ("fc-category" in frontmatter) {
                if (
                    !calendar.categories.find(
                        (c) => c.name === frontmatter["fc-category"]
                    )
                ) {
                    calendar.categories.push({
                        name: frontmatter["fantasy-category"],
                        color: "#808080",
                        id: nanoid(6)
                    });
                }
                event.category = calendar.categories.find(
                    (c) => c.name === frontmatter["fc-category"]
                )?.id;
            }
        }
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
            <input
                type="text"
                spellcheck="false"
                placeholder="Event Name"
                bind:value={event.name}
            />
        </div>
    </div>
    <div class="event-description">
        <label for="desc">Event Description</label>
        <textarea
            name="desc"
            spellcheck="false"
            placeholder="Event Description"
            bind:value={event.description}
        />
    </div>
    <div class="setting-item">
        <div class="setting-item-info">
            <div class="setting-item-name">Event Category</div>
            <div class="setting-item-description" />
        </div>
        <div class="setting-item-control">
            <select class="dropdown" bind:value={event.category}>
                {#each calendar.categories as category}
                    <option
                        selected={event.category == category.id}
                        value={category.id}>{category.name}</option
                    >
                {/each}
            </select>
        </div>
    </div>
</div>
