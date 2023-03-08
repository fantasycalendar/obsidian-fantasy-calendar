<script lang="ts">
    import type { Calendar } from "src/@types";
    import {
        dateString,
        isValidDay,
        isValidMonth,
        isValidYear
    } from "src/utils/functions";
    import { getContext } from "svelte";
    import { Writable } from "svelte/store";
    import DateWithValidation from "../Utilities/DateWithValidation.svelte";
    import Details from "../Utilities/Details.svelte";

    const calendar = getContext("store");
    const { validDate, currentStore, monthStore } = calendar;
    $: desc = $validDate
        ? dateString($currentStore, $monthStore)
        : "Invalid date";
</script>

<Details
    name={"Current Date"}
    warn={!$validDate}
    label={"Invalid current date specified"}
    {desc}
    open={false}
>
    <DateWithValidation />
</Details>
