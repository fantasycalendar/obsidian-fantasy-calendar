<script lang="ts">
    import type { Calendar } from "src/@types";
    import { getContext } from "svelte";
    import { Writable } from "svelte/store";
    import TextAreaComponent from "../Settings/TextAreaComponent.svelte";
    import TextComponent from "../Settings/TextComponent.svelte";
    import ToggleComponent from "../Settings/ToggleComponent.svelte";

    export let calendar: Calendar;

    const store = getContext<Writable<Calendar>>("store");
    store.subscribe((v) => (calendar = v));

    $: displayDayNumber = calendar.static.displayDayNumber;
    $: incrementDay = calendar.static.incrementDay;
</script>

<div class="fantasy-calendar-info">
    <TextComponent
        name={"Calendar Name"}
        value={calendar.name}
        on:blur={(evt) => {
            calendar.name = evt.detail;
            store.set(calendar);
        }}
    />
    <TextAreaComponent
        name={"Calendar Description"}
        value={calendar.description}
        on:blur={(evt) => (calendar.description = evt.detail)}
    />
    <ToggleComponent
        name={"Display Day Number"}
        desc={"Display day of year in Day View"}
        value={displayDayNumber}
        on:click={() => {
            calendar.static.displayDayNumber =
                !calendar.static.displayDayNumber;
        }}
    />
    <ToggleComponent
        name={"Auto Increment Day"}
        desc={"Automatically increment the current day every real-world day."}
        value={incrementDay}
        on:click={() => {
            calendar.static.incrementDay = !calendar.static.incrementDay;
        }}
    />
</div>

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
