<script lang="ts">
    import type CalendarHelper from "src/helper";

    import type { MonthHelper } from "src/helper";
    import { getContext, onMount, tick } from "svelte";
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
    });

    let appendObserver = new IntersectionObserver(
        () => {
            appendMonth();
            appendObserver.disconnect();
            appendObserver.observe(yearContainer.lastElementChild);
        },
        {
            root: yearContainer,
            rootMargin: "0px",
            threshold: 0.5
        }
    );
    let prependObserver = new IntersectionObserver(
        () => {
            prependMonth();
            prependObserver.disconnect();
            prependObserver.observe(yearContainer.firstElementChild);
        },
        {
            root: yearContainer,
            rootMargin: "0px",
            threshold: 0.5
        }
    );

    onMount(async () => {
        const currentEl = yearContainer.querySelector(
            `#MONTH-${calendar.currentMonth.id}-${year}`
        );
        currentEl.scrollIntoView(true);
        prependMonth();
        appendMonth();

        prependObserver.observe(yearContainer.children[0]);
        appendObserver.observe(
            yearContainer.children[yearContainer.children.length - 1]
        );
    });

    const dayViewStore = getContext<Writable<boolean>>("dayView");
    const moonStore = getContext<Writable<boolean>>("displayMoons");
    //https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const prependMonth = () => {
        let previous = calendar.getMonth(-1, year);
        const month = new Month({
            target: yearContainer,
            anchor: yearContainer.children[0],
            props: {
                month: previous,
                fullView: false,
                yearView: true,
                columns,
                weeks: calendar.weekdays.length,
                showPad: false
            },
            context: new Map([
                ["dayView", dayViewStore],
                ["displayMoons", moonStore]
            ])
        });
    };
    const appendMonth = () => {
        let previous = calendar.getMonth(calendar.months.length, year);
        const month = new Month({
            target: yearContainer,
            props: {
                month: previous,
                fullView: false,
                yearView: true,
                columns,
                weeks: calendar.weekdays.length,
                showPad: false
            },
            context: new Map([
                ["dayView", dayViewStore],
                ["displayMoons", moonStore]
            ])
        });
        return month;
    };

    const reset = () => {
        const year = calendar.current.year;
        months = [
            /* ...calendar.getMonthsForYear(year - 1), */
            ...calendar.getMonthsForYear(year)
            /* ...calendar.getMonthsForYear(year + 1) */
        ];
        const currentEl = yearContainer.querySelector(
            `#MONTH-${calendar.data.months[0].id}-${year}`
        );

        currentEl.scrollIntoView(true);
    };

    //use an intersection observer
    const checkScroll = (evt: Event) => {};
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
        {#each months as month}
            <Month
                {month}
                fullView={false}
                yearView={true}
                {columns}
                weeks={month.calendar.weekdays.length}
                showPad={false}
                on:day-click
                on:day-doubleclick
                on:day-context-menu
                on:event-click
                on:event-mouseover
            />
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
</style>
