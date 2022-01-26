<script lang="ts">
    import type { Calendar } from "src/@types";
    import {
        Setting,
        TextAreaComponent,
        TextComponent,
        ToggleComponent
    } from "obsidian";
    import { getDetachedSetting } from "../utils";

    export let calendar: Calendar;

    let nameComponent: TextComponent;
    let descComponent: TextAreaComponent;
    let displayComponent: ToggleComponent;
    let incComponent: ToggleComponent;

    $: name = calendar.name;
    $: desc = calendar.description;
    $: displayDayNumber = calendar.static.displayDayNumber;
    $: incrementDay = calendar.static.incrementDay;

    const build = (containerEl: HTMLElement) => {
        new Setting(containerEl).setName("Calendar Name").addText((t) => {
            nameComponent = t
                .setValue(name)
                .onChange((v) => (calendar.name = v));
        });

        const descEl = containerEl.createDiv(
            "setting-item fantasy-calendar-description"
        );
        descEl.createEl("label", { text: "Calendar Description" });
        descComponent = new TextAreaComponent(descEl)
            .setPlaceholder("Calendar Description")
            .setValue(desc)
            .onChange((v) => {
                calendar.description = v;
            });
        new Setting(containerEl)
            .setName("Display Day Number")
            .addToggle((t) => {
                displayComponent = t
                    .setValue(displayDayNumber)
                    .onChange((v) => {
                        calendar.static.displayDayNumber = v;
                    });
            });
        new Setting(containerEl)
            .setName("Auto Increment Day")
            .setDesc("Automatically increment the calendar day every real day.")
            .addToggle((t) => {
                incComponent = t.setValue(incrementDay).onChange((v) => {
                    calendar.static.incrementDay = v;
                });
            });
    };
</script>

<div class="fantasy-calendar-info" use:build />

<style>
    .fantasy-calendar-info :global(.setting-item) {
        padding-top: 18px;
    }
    .fantasy-calendar-info :global(.fantasy-calendar-description) {
        display: flex;
        flex-flow: column;
        align-items: flex-start;
    }
    .fantasy-calendar-info
        :global(.fantasy-calendar-description)
        :global(textarea) {
        width: 100%;
    }
</style>
