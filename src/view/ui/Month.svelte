<script lang="ts">
    import { MonthHelper } from "src/helper/month.helper";
    import Day from "./Day.svelte";
    import { DayHelper } from "src/helper/day.helper";

    export let yearView: boolean = false;
    export let month: MonthHelper;

    export let columns: number;
    export let fullView: boolean = false;
    export let weeks: number;

    export let intercalary = false;

    export let showPad: boolean = true;

    $: padded = month.calendar.getPaddedDaysForMonth(month);
    $: previous = padded.previous;
    $: current = month.days;
    $: next = padded.next;

    const getLeapDayArray = (day: DayHelper) => {
        const weekday = day.weekday;
        const remaining = day.calendar.weekdays.length - weekday;

        let next: number[] = [];
        if (remaining != 0) next = [...Array(remaining).keys()];
        let prev: number[] = [];
        if (weekday != 0) prev = [...Array(weekday).keys()];

        return { next, prev };
    };
</script>

<div
    class="month"
    class:intercalary
    class:full-view={fullView}
    data-id={month.id}
    id={`MONTH-${month.id}-${month.year}`}
>
    {#if yearView}
        <h3 class="month-name">{month.name}</h3>
    {/if}
    {#if intercalary}
        <span class="month">{month.name}</span>
    {/if}
    {#key current}
        <div
            class="fantasy-month"
            class:full-view={fullView}
            class:year-view={yearView}
            style="--calendar-columns: {columns};--calendar-rows: {fullView
                ? `${(1 / weeks) * 100}%`
                : '1fr'}; "
        >
            {#each previous as day}
                {#if showPad && day != null}
                    <Day {day} adjacent={true} {fullView} />
                {:else}
                    <div />
                {/if}
            {/each}
            {#each current as day}
                {#if day.leapday}
                    {#each getLeapDayArray(day).next as pad}
                        <div />
                    {/each}
                    <div class="leapday-container">
                        {#if day.leapday.numbered}
                            {day.leapday.name}
                            <Day
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
                        {:else}
                            {day.leapday.name}
                        {/if}
                    </div>
                    {#each getLeapDayArray(day).prev as pad}
                        <div />
                    {/each}
                {/if}
                {#if !day.leapday?.numbered}
                    <Day
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
                {/if}
            {/each}
            {#each next as day}
                {#if showPad}
                    <Day {day} adjacent={true} {fullView} />
                {:else}
                    <div />
                {/if}
            {/each}
        </div>
    {/key}
</div>

<style>
    .fantasy-month {
        display: grid;
        grid-template-columns: repeat(
            var(--calendar-columns),
            var(--column-widths)
        );

        grid-auto-rows: var(--calendar-rows);
    }
    .intercalary {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        border-top: 1px solid var(--background-modifier-border);
        border-bottom: 1px solid var(--background-modifier-border);
        border-radius: 0;
        align-items: center;
    }
    .intercalary span.month {
        text-align: center;
    }
    .intercalary .fantasy-month {
        grid-template-columns: unset;
        grid-auto-columns: var(--column-widths);
        align-items: center;
        justify-content: center;
    }
    .leapday-container {
        grid-column: span var(--calendar-columns);
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid var(--background-modifier-border);
        border-bottom: 1px solid var(--background-modifier-border);
        color: var(--text-accent);
    }

    .full-view {
        height: 100%;
        margin-bottom: 0.5rem;
    }

    .month {
        padding: 0.25rem;
    }

    .month-name {
        margin: 0;
    }
    .month :global(.fantasy-day.day) {
        padding: 0px;
    }
</style>
