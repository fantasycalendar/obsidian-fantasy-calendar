<script lang="ts">
    import type { MonthHelper } from "src/helper";

    import Month from "./Month.svelte";

    export let fullView: boolean;
    export let months: MonthHelper[];
    export let columns: number;
</script>

<div class="year" class:full-view={fullView}>
    {#each months as month}
        <Month
            {month}
            fullView={false}
            yearView={true}
            {columns}
            weeks={month.calendar.weekdays.length}
            showPad={false}
            on:day-click
            on:day-doubleclick
            on:day-context-menu
            on:event-click
            on:event-mouseover
        />
    {/each}
</div>

<style>
    .year {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        overflow: auto;
        flex: 1;
    }
    .year:not(.full-view) {
        grid-template-columns: 1fr;
    }

    .full-view .fantasy-title {
        grid-column: span 3;
    }
    .fantasy-title {
        margin: 0;
    }
</style>
