<script lang="ts">
    import type { Calendar } from "src/@types";
    import CalendarHelper from "src/calendar/index";

    import MonthView from "./MonthView.svelte";

    export let data: Calendar;
    const calendar = new CalendarHelper(data);

    calendar.on("month-update", () => {
        weeks = calendar.weeksPerCurrentMonth;
        days = calendar.daysOfCurrentMonth;
    });

    $: weekdays = calendar.weekdays;
    $: weeks = calendar.weeksPerCurrentMonth;
    $: days = calendar.daysOfCurrentMonth;

    console.log(calendar.firstDayOfMonth(calendar.months[3]));
</script>

<div
    class="fantasy-calendar"
    style="--calendar-columns: {calendar.weekdays
        .length}; --calendar-rows: {calendar.weeksPerCurrentMonth};"
>
    <MonthView columns={weekdays.length} rows={weeks} {days} />
</div>

<style>
</style>
