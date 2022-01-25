<script lang="ts">
    import { DropdownComponent, TextComponent } from "obsidian";

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
        const label = node.createEl("label", { text: "Month" });
        new TextComponent(node).setPlaceholder("Month");
    };
</script>

<div class="fantasy-calendar-date-field">
    <div use:day />
    <div use:month />
    <div use:year />
</div>

<style>
    .fantasy-calendar-date-field {
        display: grid;
        grid-template-columns: 33% 33% 33%;
    }
</style>
