<script lang="ts">
    import type { DayHelper, MonthHelper } from "src/helper";
    import DayView from "./Day.svelte";

    export let yearView: boolean = false;
    export let month: MonthHelper;
    /* export let previous: DayHelper[];
    export let current: DayHelper[];
    export let next: DayHelper[]; */

    export let columns: number;
    export let fullView: boolean = false;
    export let weeks: number;

    export let showPad: boolean = true;

    $: padded = month.calendar.getPaddedDaysForMonth(month);
    $: previous = padded.previous;
    $: current = month.days;
    $: next = padded.next;
</script>

<div
    class="fantasy-month"
    class:full-view={fullView}
    class:year-view={yearView}
    style="--calendar-columns: {columns}; --column-widths: {(1 / columns) *
        100}%;--calendar-rows: {fullView ? `${(1 / weeks) * 100}%` : '1fr'}; "
>
    {#each previous as day}
        {#if showPad}
            <DayView {day} adjacent={true} {fullView} />
        {:else}
            <div />
        {/if}
    {/each}
    {#each current as day}
        <DayView
            {day}
            adjacent={false}
            {fullView}
            on:day-click
            on:day-doubleclick
            on:day-context-menu
            on:event-click
            on:event-mouseover
            on:event-context
        />
    {/each}
    {#each next as day}
        {#if showPad}
            <DayView {day} adjacent={true} {fullView} />
        {:else}
            <div />
        {/if}
    {/each}
</div>

<style>
    .fantasy-month {
        display: grid;
        grid-template-columns: repeat(
            var(--calendar-columns),
            var(--column-widths)
        );

        grid-auto-rows: var(--calendar-rows);
        /* gap: 2px; */
    }

    .full-view {
        height: 100%;
        margin-bottom: 0.5rem;
    }
</style>
