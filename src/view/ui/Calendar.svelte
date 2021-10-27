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
        month = calendar.currentMonth;
        weeks = calendar.weeksOfMonth(month);
        months = calendar.getMonthsForYear(year);
    });

    $: weekdays = calendar.weekdays;
    $: year = calendar.displayed.year;
    $: month = calendar.currentMonth;
    $: months = calendar.getMonthsForYear(year);
    $: weeks = calendar.weeksOfMonth(month);
</script>

<div
    id="calendar-container"
    class="fantasy-calendar"
    class:full-view={fullView}
    class:year-view={yearView}
    style="--calendar-columns: {calendar.weekdays
        .length};--calendar-rows: {calendar.weeksPerCurrentMonth};"
>
    {#if yearView && !fullView}
        <YearView
            {months}
            {year}
            {fullView}
            columns={weekdays.length}
            current={calendar.displayedDate}
            on:next={() => calendar.goToNextYear()}
            on:previous={() => calendar.goToPreviousYear()}
            on:reset={() => calendar.reset()}
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
            on:reset={() => calendar.reset()}
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
            {year}
            current={calendar.displayedDate}
            on:next={() => calendar.goToNext()}
            on:previous={() => calendar.goToPrevious()}
            on:reset={() => calendar.reset()}
            on:settings
        />
        {#if month.type == "month"}
            <div class="weekdays">
                {#each weekdays as day}
                    <span class="weekday fantasy-weekday"
                        >{day.name.slice(0, 3)}</span
                    >
                {/each}
            </div>
        {/if}
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
        <!-- previous={days.previous}
            current={days.current}
            next={days.next} -->
    {/if}
</div>
{#if dayView && !fullView}
    <hr />
    <DayView
        on:close={() => (dayView = false)}
        on:event-click
        on:event-mouseover
        on:event-context
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
    .weekdays {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);
        grid-template-rows: auto;
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
    }
    hr {
        margin: 1rem 0;
    }
</style>
