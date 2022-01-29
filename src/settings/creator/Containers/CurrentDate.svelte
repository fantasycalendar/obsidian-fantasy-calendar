<script lang="ts">
    import { DropdownComponent, Setting, TextComponent } from "obsidian";

    import type { Calendar } from "src/@types";
    import { getContext } from "svelte";
    import { Writable } from "svelte/store";

    let calendar: Calendar;
    const store = getContext<Writable<Calendar>>("store");

    store.subscribe((v) => (calendar = v));

    $: current = calendar.current;
    $: months = calendar.static.months;

    const day = (node: HTMLElement) => {
        const label = node.createEl("label", { text: "Day" });
        new TextComponent(node).setPlaceholder("Day");
    };
    const month = (node: HTMLElement) => {
        node.createEl("label", { text: "Month" });
        new DropdownComponent(node);
    };
    const year = (node: HTMLElement) => {
        const label = node.createEl("label", { text: "Year" });
        new TextComponent(node).setPlaceholder("Year");
    };
</script>

<div class="fantasy-calendar-date-field-container setting-item ">
    <div class="fantasy-calendar-date-field ">
        <label for="">Day</label>
        <input type="number" spellcheck="false" placeholder="Day" />
    </div>
    <div class="fantasy-calendar-date-field ">
        <label for="">Month</label>
        <select class="dropdown">
            {#each months.filter((m) => m.name) as month}
                <option value={month.id}>{month.name}</option>
            {/each}
        </select>
    </div>
    <div class="fantasy-calendar-date-field ">
        <label for="">Year</label>
        <input type="number" spellcheck="false" placeholder="Year" />
    </div>
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
        gap: 0.5rem;
    }
</style>
