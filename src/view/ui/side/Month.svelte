<script lang="ts">
    import type { Day } from "src/@types";
    import type { DayHelper } from "src/calendar";
    import DayView from "./Day.svelte";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let days: {
        previous: DayHelper[];
        current: DayHelper[];
        next: DayHelper[];
    };
    export let weekdays: Day[];
    export let columns: number;
    export let rows: number;

    const dayClick = (day: DayHelper) => {
        dispatch("day-click", day);
    };
</script>

<div
    class="fantasy-month"
    style="--calendar-columns: {columns}; --calendar-rows: {rows};"
>
    {#each weekdays as day}
        <span class="weekday fantasy-weekday">{day.name.slice(0, 3)}</span>
    {/each}
    {#each days.previous as day}
        <DayView {day} adjacent={true} on:day-click />
    {/each}
    {#each days.current as day}
        <DayView {day} adjacent={false} on:day-click />
    {/each}
    {#each days.next as day}
        <DayView {day} adjacent={true} on:day-click />
    {/each}
</div>

<style>
    .fantasy-month {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);
        grid-template-rows: repeat(var(--calendar-rows), 1fr);
    }
    .weekday {
        background-color: var(--color-background-heading);
        color: var(--color-text-heading);
        font-size: 0.6em;
        letter-spacing: 1px;
        padding: 4px;
        text-transform: uppercase;
        text-align: center;
    }
</style>
