<script lang="ts">
    import type { DayHelper } from "src/helper";
    import type { Event } from "src/@types";
    import Dots from "./Dots.svelte";
    import Moon from "./Moon.svelte";

    import { createEventDispatcher, getContext } from "svelte";
    import Flags from "./Flags.svelte";
    import type { Writable } from "svelte/store";

    const dispatch = createEventDispatcher();

    export let day: DayHelper;

    export let adjacent: boolean;
    export let fullView: boolean;
    let events: Event[] = [];

    $: {
        if (!adjacent) {
            events = day.events;
        }
    }
    $: moons = day.moons;
    $: categories = day.calendar.categories;
    $: date = day.date;
    $: today = day.isCurrentDay;
    $: displaying = day.isDisplaying;

    let dayView: boolean;
    const dayViewStore = getContext<Writable<boolean>>("dayView");
    dayViewStore.subscribe((v) => (dayView = v));
    $: dayView = dayView;

    let displayMoons: boolean;
    const moonStore = getContext<Writable<boolean>>("displayMoons");
    moonStore.subscribe((v) => (displayMoons = v));

    day.calendar.on("month-update", () => {
        today = day.isCurrentDay;
        displaying = day.isDisplaying;
        events = day.events;
    });
    day.calendar.on("day-update", () => {
        today = day.isCurrentDay;
        displaying = day.isDisplaying;
    });
</script>

<div
    class:day={true}
    class:fantasy-day={true}
    class:active={today && !adjacent}
    class:viewing={dayView && displaying && !adjacent}
    class={adjacent ? "adjacent-month fantasy-adjacent-month" : ""}
    aria-label={!fullView && events.length
        ? `${events.length} event${events.length == 1 ? "" : "s"}`
        : undefined}
    on:click={() => dispatch("day-click", day)}
    on:dblclick={() => dispatch("day-doubleclick", day)}
    on:contextmenu={(evt) => dispatch("day-context-menu", { day, evt })}
>
    <span>
        {day.number}
    </span>
    {#if fullView}
        {#if displayMoons && moons && moons.length}
            <div class="moon-container">
                {#each moons as [moon, phase]}
                    <Moon {moon} {phase} />
                {/each}
            </div>
        {/if}
        <Flags
            {events}
            {categories}
            {date}
            calendar={day.calendar}
            on:event-click
            on:event-mouseover
            on:event-context
        />
    {:else}
        <Dots {events} {categories} calendar={day.calendar} />
    {/if}
</div>

<style>
    .day {
        background-color: transparent;
        border: 2px solid transparent;
        border-radius: 4px;
        color: var(--color-text-day);
        cursor: pointer;
        font-size: 0.8em;
        height: 100%;
        padding: 2px;
        position: relative;
        text-align: center;
        vertical-align: baseline;
        overflow: visible;
        display: flex;
        flex-flow: column nowrap;
    }
    .active {
        background-color: var(--background-secondary);
    }

    .viewing {
        border: 2px solid var(--background-modifier-border);
    }

    .adjacent-month {
        opacity: 0.25;
    }
</style>
