<script lang="ts">
    import { ViewState } from "src/stores/calendar.store";
    import { getTypedContext } from "../view";
    import Day from "./Day.svelte";
    import Year from "./Year/Year.svelte";

    export let year: number;
    export let month: number;

    const global = getTypedContext("store");
    const ephemeral = getTypedContext("ephemeralStore");
    const store = $global;
    const { yearCalculator, staticStore } = store;
    $: previousMonth = ephemeral.getPreviousMonth(month, year);
    $: nextMonth = ephemeral.getNextMonth(month, year);
    $: displayWeeks = ephemeral.displayWeeks;
    $: viewState = ephemeral.viewState;

    const { staticConfiguration } = staticStore;
    $: displayedMonth = yearCalculator
        .getYearFromCache(year)
        .getMonthFromCache(month);
    $: ({ weekdays, days, lastDay, firstWeekNumber, weeks } = displayedMonth);
    $: ({ lastDay: previousLastDay, days: previousDays } = previousMonth);

    $: extraWeek = $weekdays.length - $lastDay <= 3 ? 1 : 0;
    const tbody = (node: HTMLElement) => {
        let row = node.createEl("tr");
        if ($staticConfiguration.overflow) {
            for (let i = 0; i < $previousLastDay; i++) {
                if ($viewState == ViewState.Year) {
                    row.createEl("td");
                } else {
                    new Day({
                        target: row,
                        props: {
                            adjacent: true,
                            number: $previousDays - $previousLastDay + i + 1,
                            month: previousMonth,
                        },
                    });
                }
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
                if ($viewState == ViewState.Year) {
                    row.createEl("td");
                } else {
                    new Day({
                        target: row,
                        props: {
                            adjacent: true,
                            number: i + 1,
                            month: nextMonth,
                        },
                    });
                }
            }
        }
    };
</script>

{#if $viewState == ViewState.Year}
    <h4 class="month-header">
        <span class="fantasy-month month">{displayedMonth.name}</span>
    </h4>
{/if}
<table class="month-container">
    <tbody>
        <tr>
            {#if $displayWeeks}
                <td>
                    <table class="week-number-table fantasy-calendar">
                        <colgroup>
                            <col class="week-numbers" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="weekday">
                                    <span>W</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each [...Array($weeks).keys()] as week}
                                <tr>
                                    <td>
                                        <span class="week-num"
                                            >{$firstWeekNumber + 1 + week}</span
                                        >
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </td>
            {/if}
            <td>
                <table class="calendar fantasy-calendar month">
                    <colgroup>
                        {#each $weekdays as day}
                            <col class={day.name} />
                        {/each}
                    </colgroup>
                    <thead>
                        <tr>
                            {#each $weekdays as day}
                                <th class="weekday"
                                    >{day.name.slice(0, 3).toUpperCase()}</th
                                >
                            {/each}
                        </tr>
                    </thead>
                    {#key displayedMonth}
                        <tbody use:tbody />
                    {/key}
                </table>
            </td>
        </tr>
    </tbody>
</table>

<style scoped>
    table {
        height: 100%;
    }
    .month-header {
        margin-bottom: 0;
    }
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
    .week-number-table {
        border-right: 1px solid var(--blockquote-border-color);
        padding-right: 0.5rem;
    }
    .week-number-table td {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .week-num {
        background-color: transparent;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.65em;
        margin-top: 6px;
    }
</style>
