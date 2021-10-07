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
    export let columns: number;
    export let fullView: boolean = false;
</script>

<div
    class="fantasy-month"
    class:full-view={fullView}
    style="--calendar-columns: {columns};"
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
            on:day-context-menu
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
    }

    .full-view {
        height: 100%;
    }
</style>
