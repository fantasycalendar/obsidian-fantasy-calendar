<script lang="ts">
    import type CalendarHelper from "src/helper";

    import type { MonthHelper } from "src/helper";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";

    import Month from "./Month.svelte";
    import YearNav from "./YearNav.svelte";

    export let current: string;
    export let months: MonthHelper[];
    export let year: number;
    export let columns: number;
    export let fullView: boolean;

    let yearContainer: HTMLDivElement;

    const calendarStore = getContext<Writable<CalendarHelper>>("calendar");
    let calendar: CalendarHelper;
    calendarStore.subscribe((c) => {
        calendar = c;
        months = [
            ...calendar.getMonthsForYear(year - 1),
            ...months,
            ...calendar.getMonthsForYear(year + 1)
        ];
    });

    let currentEl: HTMLDivElement;
    let nextEl: HTMLDivElement;
    let previousEl: HTMLDivElement;
    let dif: number;
    let mounted = false;

    onMount(() => {
        mounted = true;
        const currentEl = yearContainer.querySelector<HTMLDivElement>(
            `#MONTH-${calendar.data.months[0].id}-${year}`
        );
        const nextEl = yearContainer.querySelector<HTMLDivElement>(
            `#MONTH-${calendar.data.months[0].id}-${year + 1}`
        );

        dif = nextEl.offsetTop - currentEl.offsetTop;

        currentEl.scrollIntoView(true);
    });
    const reset = () => {
        const year = calendar.current.year;
        months = [
            ...calendar.getMonthsForYear(year - 1),
            ...calendar.getMonthsForYear(year),
            ...calendar.getMonthsForYear(year + 1)
        ];
        const currentEl = yearContainer.querySelector(
            `#MONTH-${calendar.data.months[0].id}-${year}`
        );

        currentEl.scrollIntoView(true);
    };
    let previousTop: number;
    let accum: number;
    //TODO: months = [...months etc] wasn't just pushing, it was updating what was displayed on screen
    const checkScroll = (evt: Event) => {
        const target = evt.target as HTMLDivElement;
        const scrollHeight = target.scrollHeight;

        const top = target.scrollTop;
        if (!previousTop) previousTop = top;
        const bottom = target.scrollTop + target.clientHeight;

        console.log(top, dif / 2);

        if (top < previousTop && top <= dif / 2) {
            //scrolled up;
            console.log("up");
        } else if (top > previousTop) {
            //scrolled down
            console.log("down");
        }

        previousTop = top;
    };
</script>

<div class="year-view">
    <YearNav
        {year}
        {current}
        on:next
        on:previous
        on:reset={reset}
        on:settings
    />
    <!-- <div class="year-container"> -->
    <div
        class="year"
        class:full-view={fullView}
        on:scroll={checkScroll}
        bind:this={yearContainer}
    >
        {#each months as month, index}
            {#if index > 0 && months[index - 1].year != month.year}
                <h2 class="fantasy-title">
                    <span class="fantasy-year">{month.year}</span>
                </h2>
            {/if}
            <div class="month" id={`MONTH-${month.data.id}-${month.year}`}>
                <h3 class="month-name">{month.name}</h3>
                <Month
                    {month}
                    fullView={false}
                    {columns}
                    weeks={month.calendar.weekdays.length}
                    showPad={false}
                    on:day-click
                    on:day-doubleclick
                    on:day-context-menu
                    on:event-click
                    on:event-mouseover
                />
            </div>
        {/each}
    </div>
    <!-- </div> -->
</div>

<style>
    .year-view {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .year {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        overflow: auto;
        flex: 1;
    }
    .year:not(.full-view) {
        grid-template-columns: 1fr;
    }

    .full-view .fantasy-title {
        grid-column: span 3;
    }
    .fantasy-title {
        margin: 0;
    }
    .month {
        border-radius: 1rem;
        padding: 0.25rem;
    }

    .month-name {
        margin: 0;
    }
    .month :global(.fantasy-day.day) {
        padding: 0px;
    }
</style>
