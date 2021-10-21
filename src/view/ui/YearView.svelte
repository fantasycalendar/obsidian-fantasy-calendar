<script lang="ts">
    import type CalendarHelper from "src/helper";

    import type { MonthHelper } from "src/helper";
    import {
        createEventDispatcher,
        getContext,
        onDestroy,
        onMount,
        tick
    } from "svelte";
    import type { Writable } from "svelte/store";

    import Month from "./Month.svelte";
    import YearNav from "./YearNav.svelte";

    const dispatch = createEventDispatcher();

    export let current: string;
    export let months: MonthHelper[];
    export let year: number;
    export let columns: number;
    export let fullView: boolean;

    let yearContainer: HTMLDivElement;

    let firstMonth = months[0];
    let lastMonth = months[months.length - 1];

    const calendarStore = getContext<Writable<CalendarHelper>>("calendar");
    let calendar: CalendarHelper;
    calendarStore.subscribe((c) => {
        calendar = c;
    });

    const trackedMonths: Array<Month | HTMLHeadingElement> = [];

    const dayViewStore = getContext<Writable<boolean>>("dayView");
    const moonStore = getContext<Writable<boolean>>("displayMoons");

    const appendObserver = new IntersectionObserver(
        (entries, observer) => {
            if (observer !== appendObserver) return;
            if (!entries.length) return;
            if (!entries[0].isIntersecting) return;
            appendObserver.disconnect();
            appendMonth();
            destroy(trackedMonths.shift());
            resetAppend();
        },
        {
            root: yearContainer,
            rootMargin: "0px",
            threshold: 0.25
        }
    );
    const resetAppend = () => {
        const el = yearContainer.children[yearContainer.children.length - 2];
        appendObserver.observe(el);
    };
    const appendHeaderObserver = new IntersectionObserver(
        (entries, observer) => {
            if (observer !== appendHeaderObserver) return;
            /**
             * This observer looks at the prepended header (current year). Once this header is fully in view, the year variable should be decremented.
             */
            if (!entries && !entries.length) return;
            if (entries[0].isIntersecting) return;

            const yearRect = yearContainer.getBoundingClientRect();

            if (entries[0].boundingClientRect.top < yearRect.top) {
                year += 1;
                prependHeaderObserver.observe(entries[0].target);
                appendHeaderObserver.disconnect();
            }
        },
        {
            root: yearContainer,
            rootMargin: "0px",
            threshold: 0
        }
    );
    /** This function will append a new month svelte instance to the year container. */
    const appendMonth = (reset = true) => {
        lastMonth = calendar.getMonth(lastMonth.number + 1, lastMonth.year);

        if (
            lastMonth.number === 0 &&
            !(yearContainer.lastElementChild instanceof HTMLHeadingElement)
        ) {
            const header = yearContainer.createEl("h2", {
                text: `${lastMonth.year}`,
                cls: "fantasy-title"
            });
            trackedMonths.push(header);
            appendHeaderObserver.disconnect();
            appendHeaderObserver.observe(header);
        }

        trackedMonths.push(createMonth(lastMonth, false));

        if (reset) {
            firstMonth = calendar.getMonth(
                firstMonth.number + 1,
                firstMonth.year
            );
            resetPrepend();
        }
    };

    const prependObserver = new IntersectionObserver(
        (entries, observer) => {
            if (observer !== prependObserver) return;
            if (!entries.length) return;
            if (!entries[0].isIntersecting) return;
            prependObserver.disconnect();
            prependMonth();
            destroy(trackedMonths.pop());
            resetPrepend();
        },
        {
            root: yearContainer,
            rootMargin: "0px",
            threshold: 0.25
        }
    );
    const resetPrepend = () => {
        const el = yearContainer.children[1];
        prependObserver.observe(el);
    };
    const prependHeaderObserver = new IntersectionObserver(
        (entries, observer) => {
            if (observer !== prependHeaderObserver) return;
            /**
             * This observer looks at the prepended header (current year). Once this header is fully in view, the year variable should be decremented.
             */
            if (!entries && !entries.length) return;
            if (entries[0].isIntersecting) {
                year -= 1;
                appendHeaderObserver.observe(entries[0].target);
                prependHeaderObserver.disconnect();
            }
        },
        {
            root: yearContainer,
            rootMargin: "0px",
            threshold: 0
        }
    );

    /** This function will prepend a new month svelte instance to the year container. */
    const prependMonth = (reset = true) => {
        firstMonth = calendar.getMonth(firstMonth.number - 1, firstMonth.year);

        trackedMonths.unshift(createMonth(firstMonth, true));
        if (
            firstMonth.number === 0 &&
            !(yearContainer.firstElementChild instanceof HTMLHeadingElement)
        ) {
            const header = createEl("h2", {
                text: `${firstMonth.year}`,
                cls: "fantasy-title"
            });
            yearContainer.prepend(header);
            trackedMonths.unshift(header);

            prependHeaderObserver.disconnect();
            prependHeaderObserver.observe(header);
        }
        /** Update the last month to the previous last month */

        if (reset) {
            lastMonth = calendar.getMonth(lastMonth.number - 1, lastMonth.year);
            resetAppend();
        }
    };

    const createMonth = (month: MonthHelper, anchor: boolean) => {
        const svelteInstance = new Month({
            target: yearContainer,
            anchor: anchor ? yearContainer.children[0] : null,
            props: {
                month: month,
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
        svelteInstance.$on("day-click", (e) => dispatch("day-click", e.detail));
        svelteInstance.$on("day-doubleclick", (e) =>
            dispatch("day-doubleclick", e.detail)
        );
        svelteInstance.$on("day-context-menu", (e) =>
            dispatch("day-context-menu", e.detail)
        );
        svelteInstance.$on("event-mouseover", (e) =>
            dispatch("event-mouseover", e.detail)
        );
        svelteInstance.$on("event-mouseover", (e) =>
            dispatch("event-mouseover", e.detail)
        );
        return svelteInstance;
    };

    const destroy = (item: Month | HTMLHeadingElement) => {
        if (item instanceof HTMLHeadingElement) {
            item.detach();
        } else {
            item.$destroy();
        }
    };

    const reset = async (full = false) => {
        for (let item of trackedMonths) {
            destroy(item);
        }
        trackedMonths.splice(0, trackedMonths.length);
        yearContainer.empty();

        await tick();

        year = calendar.current.year;
        /** Slice it so append and prepend functions can create their headers. */
        months = calendar
            .getMonthsForYear(year)
            .slice(1, calendar.months.length - 1);
        firstMonth = months[0];
        lastMonth = months[months.length - 1];

        for (let month of months) {
            trackedMonths.push(createMonth(month, false));
        }
        prependMonth(false);
        appendMonth(false);

        await tick();
        /** All months are created when year view is reset, so current month exists. */
        const currentEl = yearContainer.querySelector(
            `#MONTH-${calendar.currentMonth.id}-${year}`
        );
        currentEl.scrollIntoView(true);
        if (full) {
            scroll();
        }
    };

    onDestroy(() => {
        prependObserver.disconnect();
        appendObserver.disconnect();
        prependHeaderObserver.disconnect();
        appendHeaderObserver.disconnect();
    });

    onMount(reset);

    const scroll = async () => {
        await tick();
        prependObserver.observe(yearContainer.children[1]);
        appendObserver.observe(
            yearContainer.children[yearContainer.children.length - 2]
        );
    };
</script>

<div class="year-view">
    <YearNav
        {year}
        {current}
        on:next
        on:previous
        on:reset={() => reset(true)}
        on:settings
    />
    <div
        class="year"
        class:full-view={fullView}
        bind:this={yearContainer}
        on:scroll|once={scroll}
    />
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
