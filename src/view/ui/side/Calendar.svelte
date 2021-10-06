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
    <MonthView
        columns={weekdays.length}
        {weekdays}
        rows={weeks + 1}
        {days}
        on:day-click
    />
</div>

<style>
</style>
