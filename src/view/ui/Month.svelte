<script lang="ts">
    import type { DayHelper } from "src/helper";
    import DayView from "./Day.svelte";

    export let days: {
        previous: DayHelper[];
        current: DayHelper[];
        next: DayHelper[];
    };
    export let columns: number;
    export let fullView: boolean = false;
    export let weeks: number;
</script>

<div
    class="fantasy-month"
    class:full-view={fullView}
    style="--calendar-columns: {columns}; --calendar-rows: {fullView
        ? `${(1 / weeks) * 100}%`
        : '1fr'}; "
>
    {#each days.previous as day}
        <DayView {day} adjacent={true} {fullView} />
    {/each}
    {#each days.current as day}
        <DayView
            {day}
            adjacent={false}
            {fullView}
            on:day-click
            on:day-doubleclick
            on:day-context-menu
            on:event-click
            on:event-mouseover
        />
    {/each}
    {#each days.next as day}
        <DayView {day} adjacent={true} {fullView} />
    {/each}
</div>

<style>
    .fantasy-month {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);

        grid-auto-rows: var(--calendar-rows);
        gap: 2px;
    }

    .full-view {
        height: 100%;
        margin-bottom: 0.5rem;
    }
</style>
