<script lang="ts">
    import type CalendarHelper from "src/helper";

    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import DayView from "./DayView.svelte";

    import MonthView from "./Month.svelte";
    import Nav from "./Nav.svelte";
    import YearView from "./YearView.svelte";
    import YearViewBig from "./YearViewBig.svelte";

    export let fullView: boolean = false;
    export let dayView: boolean = false;
    export let yearView: boolean = false;
    export let calendar: CalendarHelper;
    export let moons: boolean;
    export let displayWeeks: boolean;

    $: {
        if (yearView) dayView = false;
    }

    const dayViewStore = writable(dayView);
    const moonStore = writable(moons);
    const calendarStore = writable(calendar);
    setContext("dayView", dayViewStore);
    setContext("displayMoons", moonStore);
    setContext("calendar", calendarStore);

    $: dayViewStore.set(dayView);
    $: moonStore.set(moons);
    $: calendarStore.set(calendar);

    calendar.on("month-update", () => {
        year = calendar.displayed.year;
        yearDisplay = calendar.getNameForYear(calendar.displayed.year);
        month = calendar.currentMonth;
        weeks = calendar.weeksOfMonth(month);
        firstWeek = calendar.weekNumbersOfMonth(month);
    });

    $: weekdays = calendar.weekdays;
    $: year = calendar.displayed.year;
    $: yearDisplay = calendar.getNameForYear(calendar.displayed.year);
    $: month = calendar.currentMonth;
    $: firstWeek = calendar.weekNumbersOfMonth(month);
    $: weeks = calendar.weeksOfMonth(month);
</script>

<div
    id="calendar-container"
    class="fantasy-calendar"
    class:full-view={fullView}
    class:year-view={yearView}
    style="--calendar-columns: {calendar.weekdays
        .length};  --column-widths: {(1 / calendar.weekdays.length) *
        100}%; --calendar-rows: {calendar.weeksPerCurrentMonth};"
>
    {#if yearView && !fullView}
        <YearView
            {year}
            {fullView}
            columns={weekdays.length}
            current={calendar.displayedDate}
            on:next={() => calendar.goToNextYear()}
            on:previous={() => calendar.goToPreviousYear()}
            on:reset
            on:settings
            on:day-click
            on:day-doubleclick
            on:day-context-menu
            on:event-click
            on:event-mouseover
        />
    {:else if yearView}
        <YearViewBig
            {year}
            columns={weekdays.length}
            current={calendar.displayedDate}
            on:next={() => calendar.goToNextYear()}
            on:previous={() => calendar.goToPreviousYear()}
            on:reset
            on:settings
            on:day-click
            on:day-doubleclick
            on:day-context-menu
            on:event-click
            on:event-mouseover
        />
    {:else}
        <Nav
            month={month.name}
            year={yearDisplay}
            current={calendar.displayedDate}
            on:next={() => calendar.goToNext()}
            on:previous={() => calendar.goToPrevious()}
            on:reset
            on:settings
        />
        <div class="month-container">
            <div class="weeks">
                {#if displayWeeks}
                    <span class="week-num weekday fantasy-weekday">W</span>
                    <div class="week-num-container">
                        {#each [...Array(weeks).keys()] as num}
                            <span class="week-num">{firstWeek + 1 + num}</span>
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="month-view">
                <!-- {#if month.type == "month"} -->
                <div class="weekdays">
                    {#each weekdays as day}
                        <span class="weekday fantasy-weekday"
                            >{day.name.slice(0, 3)}</span
                        >
                    {/each}
                </div>
                <!-- {/if} -->

                <MonthView
                    columns={weekdays.length}
                    {weeks}
                    {month}
                    {fullView}
                    on:day-click
                    on:day-doubleclick
                    on:day-context-menu
                    on:event-click
                    on:event-mouseover
                    on:event-context
                />
            </div>
        </div>
    {/if}
</div>
{#if dayView && !fullView}
    <hr />
    <DayView
        on:close={() => (dayView = false)}
        on:event-click
        on:event-mouseover
        on:event-context
        on:event
    />
{/if}

<style>
    #calendar-container.year-view {
        height: 100%;
    }
    #calendar-container.fantasy-calendar.full-view {
        width: 100%;
        padding: 0 0.5rem 0.5rem;
        height: 100%;

        display: flex;
        flex-flow: column;
    }

    .fantasy-calendar.full-view .month-container {
        height: 100%;
    }

    .month-container {
        display: flex;
    }
    .month-view {
        flex-grow: 2;
    }
    .weeks {
        display: grid;
        grid-template-rows: auto 1fr;
    }
    .week-num-container {
        display: grid;
        grid-template-rows: repeat(var(--calendar-rows), auto);
        padding: 0.25rem 0;
    }
    .week-num {
        background-color: transparent;
        border: 2px solid transparent;
        border-radius: 4px;
        color: var(--color-text-day);
        cursor: pointer;
        font-size: 0.8em;
        height: 100%;
        padding: 2px;
        position: relative;
        text-align: center;
        vertical-align: baseline;
        overflow: visible;
    }
    .weekdays {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);
        grid-template-rows: auto;
        padding: 0 0.25rem;
        gap: 2px;
    }
    .weekday {
        background-color: var(--color-background-heading);
        color: var(--color-text-heading);
        font-size: 0.6em;
        letter-spacing: 1px;
        padding: 4px;
        text-transform: uppercase;
        text-align: center;
        border: 2px solid transparent;
    }
    hr {
        margin: 1rem 0;
    }

    :global(.moon-container) {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: center;
    }
</style>
