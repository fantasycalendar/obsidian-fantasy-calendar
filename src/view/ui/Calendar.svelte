<script lang="ts">
    import type CalendarHelper from "src/helper";
    import type { DayHelper, MonthHelper } from "src/helper/index";

    import MonthView from "./Month.svelte";
    import Nav from "./Nav.svelte";

    export let fullView: boolean = false;
    export let calendar: CalendarHelper;
    let days: {
            previous: DayHelper[];
            current: DayHelper[];
            next: DayHelper[];
        },
        year: number,
        month: MonthHelper;

    $: weekdays = calendar.weekdays;
    $: {
        days = calendar.paddedDays;
        year = calendar.displayed.year;
        month = calendar.currentMonth;
        calendar.on("month-update", () => {
            days = calendar.paddedDays;
            year = calendar.displayed.year;
            month = calendar.currentMonth;
        });
    }
</script>

<div
    id="calendar-container"
    class="fantasy-calendar"
    class:full-view={fullView}
    style="--calendar-columns: {calendar.weekdays.length};"
>
    <Nav
        month={month.name}
        {year}
        current={calendar.currentDate}
        on:next={() => calendar.goToNext()}
        on:previous={() => calendar.goToPrevious()}
        on:reset={() => calendar.reset()}
        on:settings
    />
    <div class="weekdays">
        {#each weekdays as day}
            <span class="weekday fantasy-weekday">{day.name.slice(0, 3)}</span>
        {/each}
    </div>
    <MonthView
        columns={weekdays.length}
        {days}
        {fullView}
        on:day-click
        on:day-context-menu
        on:event-click
    />
</div>

<style>
    #calendar-container.fantasy-calendar.full-view {
        width: 100%;
        height: 100%;
        margin: 0.5rem;

        display: flex;
        flex-flow: column;
    }
    .weekdays {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);
        grid-template-rows: auto;
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
</style>
