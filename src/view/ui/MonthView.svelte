<script lang="ts">
    import type { Day } from "src/@types";

    export let days: number[];
    export let weekdays: Day[];
    export let columns: number;
    export let rows: number;
</script>

<div
    class="fantasy-month"
    style="--calendar-columns: {columns}; --calendar-rows: {rows};"
>
    {#each weekdays as day}
        <span class="weekday">{day.name.slice(0, 3)}</span>
    {/each}
    {#each days as day}
        <span class="day">
            {day}
        </span>
    {/each}
</div>

<style>
    .fantasy-month {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);
        grid-template-rows: repeat(var(--calendar-rows), 1fr);
    }
    span {
        text-align: center;
    }
    .weekday {
        background-color: var(--color-background-heading);
        color: var(--color-text-heading);
        font-size: 0.6em;
        letter-spacing: 1px;
        padding: 4px;
        text-transform: uppercase;
    }
    .day {
        background-color: var(--color-background-day);
        border-radius: 4px;
        color: var(--color-text-day);
        cursor: pointer;
        font-size: 0.8em;
        height: 100%;
        padding: 4px;
        position: relative;
        text-align: center;
        transition: background-color 0.1s ease-in, color 0.1s ease-in;
        vertical-align: baseline;
    }
</style>
