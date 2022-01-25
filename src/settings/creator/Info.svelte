<script lang="ts">
    import { Setting, TextAreaComponent } from "obsidian";

    import type { Calendar } from "src/@types";

    import { getContext } from "svelte";
    import { Writable } from "svelte/store";
    import { getDetachedSetting } from "../utils";

    const store = getContext<Writable<Calendar>>("store");
    let calendar: Calendar;
    store.subscribe((v) => {
        calendar = v;
    });

    const name = (containerEl: HTMLElement) => {
        getDetachedSetting(containerEl)
            .setName("Calendar Name")
            .addText((t) => {
                t.setValue(calendar.name).onChange((v) => (calendar.name = v));
            });
    };
    const desc = (containerEl: HTMLElement) => {
        new TextAreaComponent(containerEl)
            .setPlaceholder("Calendar Description")
            .setValue(calendar.description)
            .onChange((v) => {
                calendar.description = v;
            });
    };
    const displayDayNumber = (containerEl: HTMLElement) => {
        getDetachedSetting(containerEl)
            .setName("Display Day Number")
            .addToggle((t) => {
                t.setValue(calendar.static.displayDayNumber).onChange((v) => {
                    calendar.static.displayDayNumber = v;
                });
            });
    };
    const incrementDay = (containerEl: HTMLElement) => {
        getDetachedSetting(containerEl)
            .setName("Auto Increment Day")
            .setDesc("Automatically increment the calendar day every real day.")
            .addToggle((t) => {
                t.setValue(calendar.static.incrementDay).onChange((v) => {
                    calendar.static.incrementDay = v;
                });
            });
    };
</script>

<div class="fantasy-calendar-info">
    <div>
        <div use:name />
    </div>
    <div class="setting-item">
        <div class="fantasy-calendar-description">
            <label for="description">Calendar Description</label>
            <div name="description" use:desc />
        </div>
    </div>
    <div>
        <div use:displayDayNumber />
    </div>
    <div>
        <div use:incrementDay />
    </div>
</div>

<style>
    .fantasy-calendar-info :global(.setting-item) {
        padding-top: 18px;
    }
    .fantasy-calendar-description,
    .fantasy-calendar-description :global(textarea) {
        width: 100%;
    }
</style>
