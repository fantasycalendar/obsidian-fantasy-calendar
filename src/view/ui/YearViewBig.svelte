<script lang="ts">
    import type CalendarHelper from "src/helper";

    import { createEventDispatcher, getContext, onMount, tick } from "svelte";
    import type { Writable } from "svelte/store";

    import YearNav from "./YearNav.svelte";
    import YearViewContainer from "./YearViewContainer.svelte";

    const dispatch = createEventDispatcher();

    const calendarStore = getContext<Writable<CalendarHelper>>("calendar");
    const dayViewStore = getContext<Writable<boolean>>("dayView");
    const moonStore = getContext<Writable<boolean>>("displayMoons");
    let calendar: CalendarHelper;
    calendarStore.subscribe((c) => {
        calendar = c;
    });

    export let year: number;
    export let current: string;
    export let columns: number;

    let yearContainer: HTMLElement;

    /** Setup for eventual infinite scroll of big year view. */
    const createYear = (year: number, anchor: boolean = false) => {
        const months =
            year === calendar.current.year
                ? [...calendar.months]
                : calendar.getMonthsForYear(year);
        const svelteInstance = new YearViewContainer({
            target: yearContainer,
            anchor: anchor ? yearContainer.children[0] : null,
            props: {
                months: months,
                fullView: true,
                columns
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
    const destroy = (item: YearViewContainer | HTMLHeadingElement) => {
        if (item instanceof HTMLHeadingElement) {
            item.detach();
        } else {
            item.$destroy();
        }
    };

    const years: Array<HTMLHeadingElement | YearViewContainer> = [];

    const next = () => {
        year = year + 1;
        reset(year);
    };
    const previous = () => {
        year = year - 1;
        reset(year);
    };

    const currentYear = () => {
        year = calendar.current.year;
        reset(year);
    };

    const reset = async (year?: number) => {
        years.forEach((el) => destroy(el));
        yearContainer.empty();

        await tick();

        year = year;

        years.push(createYear(year));
    };
    onMount(() => years.push(createYear(year)));
</script>

<div class="year-view">
    <YearNav
        {year}
        {current}
        arrows={true}
        on:next={() => next()}
        on:previous={() => previous()}
        on:reset={() => currentYear()}
        on:settings
    />
    <div class="year-container" bind:this={yearContainer} />
</div>

<style>
    .year-view {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .year-container {
        flex: 1;
        overflow: auto;
    }
</style>
