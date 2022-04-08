<script lang="ts">
    import type { Calendar } from "src/@types";
    import { isValidDay, isValidMonth, isValidYear } from "src/utils/functions";
    import { getContext } from "svelte";
    import { Writable } from "svelte/store";
    import DateWithValidation from "../Utilities/DateWithValidation.svelte";
    import Details from "../Utilities/Details.svelte";
    import {
        warning,
        invalidDayLabel,
        invalidMonthLabel,
        invalidYearLabel
    } from "../Utilities/utils";

    let calendar: Calendar;
    const store = getContext<Writable<Calendar>>("store");

    store.subscribe((v) => (calendar = v));

    $: current = calendar.current;
    $: months = calendar.static.months;

    $: validDay = isValidDay(current.day, calendar);
    $: validMonth = isValidMonth(current.month, calendar);
    $: validYear = isValidYear(current.year, calendar);
    $: invalid = !validDay || !validMonth || !validYear;
</script>

<Details
    name={"Current Date"}
    warn={invalid}
    label={"Invalid current date specified"}
>
    <DateWithValidation {calendar} date={current} />
</Details>
