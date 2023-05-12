<script lang="ts">
    import { MonthStore } from "src/stores/month.store";
    import { getTypedContext } from "../view";
    import Dots from "./Dots.svelte";

    export let month: MonthStore;
    export let number: number;
    export let adjacent: boolean;

    const store = getTypedContext("store");
    const { index, year } = month;

    const { current, eventCache } = $store;

    $: events = eventCache.getItemsOrRecalculate({
        day: number,
        month: $index,
        year: year.year,
    });
    $: today =
        !adjacent &&
        $current.day == number &&
        $current.month == $index &&
        $current.year == year.year;
</script>

<td>
    <div class="day" class:adjacent-month={adjacent} class:today>
        {number}
        <Dots events={$events} />
    </div>
</td>

<style scoped>
    .day {
        background-color: var(--color-background-day);
        border-radius: 4px;
        color: var(--color-text-day);
        cursor: pointer;
        font-size: 0.8em;
        height: 100%;
        padding: 4px;
        position: relative;
        text-align: center;
        transition: background-color 0.1s ease-in, color 0.1s ease-in;
        vertical-align: baseline;
    }
    .day:hover {
        background-color: var(--interactive-hover);
    }
    .adjacent-month {
        opacity: 0.25;
    }
    .today {
        color: var(--interactive-accent);
    }
</style>
