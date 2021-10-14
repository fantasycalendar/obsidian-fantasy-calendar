<script lang="ts">
    import type { MonthHelper } from "src/helper";

    import Month from "./Month.svelte";
    import YearNav from "./YearNav.svelte";

    export let current: string;
    export let months: MonthHelper[];
    export let year: number;
    export let columns: number;
</script>

<YearNav {year} {current} on:next on:previous on:reset on:settings />
<div class="year">
    {#each months as month}
        <div class="month">
            <h3 class="month-name">{month.name}</h3>
            <Month
                {month}
                fullView={false}
                {columns}
                weeks={month.calendar.weekdays.length}
                showPad={false}
                on:day-click
                on:day-doubleclick
                on:day-context-menu
                on:event-click
                on:event-mouseover
            />
        </div>
    {/each}
</div>

<style>
    .year {
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        overflow: auto;
    }
    .month {
        border-radius: 1rem;
        padding: 0.25rem;
    }
    .month:hover {
        background-color: var(--background-secondary);
    }

    .month-name {
        margin: 0;
    }
    .month :global(.fantasy-day.day) {
        padding: 0px;
    }
</style>
