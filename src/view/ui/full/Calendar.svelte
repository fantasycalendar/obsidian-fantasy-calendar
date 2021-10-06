<script lang="ts">
    import type { Calendar } from "src/@types";
    import CalendarHelper from "src/calendar/index";

    import MonthView from "./Month.svelte";
    import Nav from "./Nav.svelte";

    export let data: Calendar;
    const calendar = new CalendarHelper(data);

    calendar.on("month-update", () => {
        weeks = calendar.weeksPerCurrentMonth;
        days = calendar.paddedDays;
        year = calendar.current.year;
        month = calendar.currentMonth;
    });

    $: weekdays = calendar.weekdays;
    $: weeks = calendar.weeksPerCurrentMonth;
    $: days = calendar.paddedDays;
    $: month = calendar.currentMonth;
    $: year = calendar.current.year;
</script>

<div
    id="calendar-container"
    class="fantasy-calendar"
    style="--calendar-columns: {calendar.weekdays
        .length}; --calendar-rows: {calendar.weeksPerCurrentMonth};"
>
    <Nav
        month={month.name}
        {year}
        on:next={() => calendar.goToNext()}
        on:previous={() => calendar.goToPrevious()}
    />
    <div class="weekdays">
        {#each weekdays as day}
            <span class="weekday fantasy-weekday">{day.name.slice(0, 3)}</span>
        {/each}
    </div>
    <MonthView columns={weekdays.length} {days} />
</div>

<style>
    #calendar-container.fantasy-calendar {
        width: 100%;
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
