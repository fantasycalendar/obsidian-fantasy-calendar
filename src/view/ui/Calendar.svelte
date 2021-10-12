<script lang="ts">
    import type { Week } from "src/@types";

    import type CalendarHelper from "src/helper";
    import type { DayHelper, MonthHelper } from "src/helper/index";
    import DayView from "./DayView.svelte";

    import MonthView from "./Month.svelte";
    import Nav from "./Nav.svelte";

    export let fullView: boolean = false;
    export let dayView: boolean = false;
    export let calendar: CalendarHelper;
    let days: {
            previous: DayHelper[];
            current: DayHelper[];
            next: DayHelper[];
        },
        year: number,
        month: MonthHelper,
        weeks: number,
        weekdays: Week;
    $: {
        if (calendar) {
            weekdays = calendar.weekdays;
            days = calendar.paddedDays;
            year = calendar.displayed.year;
            month = calendar.currentMonth;
            weeks = calendar.weeksPerCurrentMonth;
            calendar.on("month-update", () => {
                weeks = calendar.weeksPerCurrentMonth;
                days = calendar.paddedDays;
                year = calendar.displayed.year;
                month = calendar.currentMonth;
            });
        }
    }
</script>

<div
    id="calendar-container"
    class="fantasy-calendar"
    class:full-view={fullView}
    style="--calendar-columns: {calendar.weekdays
        .length};--calendar-rows: {calendar.weeksPerCurrentMonth};"
>
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
        {days}
        {fullView}
        {dayView}
        on:day-click
        on:day-doubleclick
        on:day-context-menu
        on:event-click
        on:event-mouseover
    />
</div>
{#if dayView && !fullView}
    <hr />
    <DayView {calendar} on:close={() => (dayView = false)} />
{/if}

<style>
    #calendar-container.fantasy-calendar.full-view {
        width: 100%;
        height: 100%;
        padding: 0.5rem;

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
