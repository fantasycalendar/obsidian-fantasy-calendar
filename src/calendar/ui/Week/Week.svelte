<script lang="ts">
    import { getTypedContext } from "src/calendar/view";
    import Day from "../Day.svelte";
    import { wrap } from "src/utils/functions";
    import { get } from "svelte/store";

    const global = getTypedContext("store");
    $: store = $global;

    const ephemeral = getTypedContext("ephemeralStore");
    $: displaying = ephemeral.displaying;
    $: displayWeeks = ephemeral.displayWeeks;
    $: displayedMonth = ephemeral.displayingMonth;
    $: days = $displayedMonth.days;
    $: firstWeekNumber = $displayedMonth.firstWeekNumber;
    $: weekdays = $displayedMonth.weekdays;

    $: previousMonth = ephemeral.getPreviousMonth(
        $displaying.month,
        $displaying.year
    );
    $: nextMonth = ephemeral.getNextMonth($displaying.month, $displaying.year);

    //not zero indexed, need to subtract one
    $: currentWeekday = wrap($displaying.day - 1, $weekdays.length);

    $: week = [...Array($weekdays.length).keys()].map(
        (k) => $displaying.day + (k - currentWeekday - 1)
    );
    $: console.log("🚀 ~ file: Week.svelte:28 ~ week:", week);

    const getMonth = (number: number) => {
        if (number <= 0)
            return {
                month: previousMonth,
                number: get(previousMonth.days) - number,
            };
        if (number > $days) {
            return {
                month: nextMonth,
                number: number - $days,
            };
        }
        return {
            month: $displayedMonth,
            number,
        };
    };
</script>

<div class="week-container">
    <table>
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
                                <tr>
                                    <td>
                                        <span class="week-num"
                                            >{$firstWeekNumber}</span
                                        >
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                {/if}
                <td>
                    <table class="calendar fantasy-calendar week">
                        <colgroup>
                            {#each $weekdays as day}
                                <col class={day.name} />
                            {/each}
                        </colgroup>
                        <thead>
                            <tr>
                                {#each $weekdays as day}
                                    <th class="weekday"
                                        >{day.name
                                            .slice(0, 3)
                                            .toUpperCase()}</th
                                    >
                                {/each}
                            </tr>
                        </thead>
                        {#key displayedMonth}
                            <tbody>
                                {#each week as day}
                                    <Day {...getMonth(day)} adjacent={false} />
                                {/each}
                            </tbody>
                        {/key}
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<style scoped>
    .week {
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
