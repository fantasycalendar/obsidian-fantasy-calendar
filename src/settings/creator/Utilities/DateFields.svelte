<script lang="ts">
    import { DropdownComponent, Setting, TextComponent } from "obsidian";

    import type { Calendar } from "src/@types";

    export let calendar: Calendar;

    $: current = calendar.current;

    const day = (node: HTMLElement) => {
        const label = node.createEl("label", { text: "Day" });
        new TextComponent(node).setPlaceholder("Day");
    };
    const month = (node: HTMLElement) => {
        const label = node.createEl("label", { text: "Month" });
        new DropdownComponent(node);
    };
    const year = (node: HTMLElement) => {
        const label = node.createEl("label", { text: "Year" });
        new TextComponent(node).setPlaceholder("Year");
    };
</script>

<div class="fantasy-calendar-date-field-container setting-item">
    <div class="fantasy-calendar-date-field" use:day />
    <div class="fantasy-calendar-date-field" use:month />
    <div class="fantasy-calendar-date-field" use:year />
</div>

<style>
    .fantasy-calendar-date-field-container {
        display: flex;
        gap: 1rem;
        border: 0;
    }
    .fantasy-calendar-date-field {
        display: flex;
        flex-flow: column nowrap;
        flex: 1 1 0;
    }
</style>
