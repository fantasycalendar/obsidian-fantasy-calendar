<script lang="ts">
    import type { DayHelper } from "src/calendar";
    import DayView from "./Day.svelte";

    export let days: {
        previous: DayHelper[];
        current: DayHelper[];
        next: DayHelper[];
    };
    export let columns: number;
</script>

<div class="fantasy-month" style="--calendar-columns: {columns};">
    {#each days.previous as day}
        <DayView {day} adjacent={true} />
    {/each}
    {#each days.current as day}
        <DayView {day} adjacent={false} />
    {/each}
    {#each days.next as day}
        <DayView {day} adjacent={true} />
    {/each}
</div>

<style>
    .fantasy-month {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);
        height: 100%;
    }
</style>
