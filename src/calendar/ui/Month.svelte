<script lang="ts">
    import { getTypedContext } from "../view";
    import Day from "./Day.svelte";

    export let year: number;
    export let month: number;

    const store = getTypedContext("store");
    const { yearCalculator, previousMonth, staticStore, nextMonth } = $store;
    const { staticConfiguration } = staticStore;
    $: displayedMonth = yearCalculator
        .getYearFromCache(year)
        .getMonthFromCache(month);
    $: ({ weekdays, days, lastDay } = displayedMonth);
    $: ({ lastDay: previousLastDay, days: previousDays } = $previousMonth);

    $: extraWeek = $weekdays.length - $lastDay <= 3 ? 1 : 0;

    const tbody = (node: HTMLElement) => {
        let row = node.createEl("tr");
        if ($staticConfiguration.overflow) {
            for (let i = 0; i < $previousLastDay; i++) {
                new Day({
                    target: row,
                    props: {
                        adjacent: true,
                        number: $previousDays - $previousLastDay + i + 1,
                        month: $previousMonth,
                    },
                });
            }
        }
        for (let i = 0; i < $days; i++) {
            if (row.childElementCount >= $weekdays.length) {
                row = node.createEl("tr");
            }
            new Day({
                target: row,
                props: {
                    adjacent: false,
                    number: i + 1,
                    month: displayedMonth,
                },
            });
        }
        //-1 because its the index
        if ($staticConfiguration.overflow) {
            let remaining =
                $weekdays.length -
                row.childElementCount +
                extraWeek * $weekdays.length;
            for (let i = 0; i < remaining; i++) {
                if (row.childElementCount >= $weekdays.length) {
                    row = node.createEl("tr");
                }
                new Day({
                    target: row,
                    props: {
                        adjacent: true,
                        number: i + 1,
                        month: $nextMonth,
                    },
                });
            }
        }
    };
</script>

<table class="calendar fantasy-calendar month">
    <colgroup>
        {#each $weekdays as day}
            <col />
        {/each}
    </colgroup>
    <thead>
        <tr>
            {#each $weekdays as day}
                <th class="weekday">{day.name.slice(0, 3).toUpperCase()}</th>
            {/each}
        </tr>
    </thead>
    {#key displayedMonth}
        <tbody use:tbody />
    {/key}
</table>

<style scoped>
    .month {
        width: 100%;
        table-layout: fixed;
    }
    .weekday {
        background-color: var(--color-background-heading);
        color: var(--color-text-heading);
        font-size: 0.6em;
        letter-spacing: 1px;
        padding: 4px;
        text-transform: uppercase;
    }
</style>
