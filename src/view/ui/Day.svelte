<script lang="ts">
    import type { DayHelper } from "src/helper";
    import Dots from "./Dots.svelte";
    import Moon from "./Moon.svelte";

    import { createEventDispatcher, getContext } from "svelte";
    import Flags from "./Flags.svelte";
    import type { Writable } from "svelte/store";

    const dispatch = createEventDispatcher();

    export let day: DayHelper;

    export let adjacent: boolean;
    export let fullView: boolean;

    $: moons = day.moons;
    $: categories = day.calendar.object.categories;
    $: date = day.date;

    let dayView: boolean;
    const dayViewStore = getContext<Writable<boolean>>("dayView");
    dayViewStore.subscribe((v) => (dayView = v));
    $: dayView = dayView;

    let displayMoons: boolean;
    const moonStore = getContext<Writable<boolean>>("displayMoons");
    moonStore.subscribe((v) => (displayMoons = v));

    $: today = day.isCurrentDay;
    $: displaying = day.isDisplaying;

    day.calendar.on("month-update", () => {
        today = day.isCurrentDay;
        displaying = day.isDisplaying;
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
    aria-label={!fullView && day.events.length
        ? `${day.events.length} event${day.events.length == 1 ? "" : "s"}`
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
            events={day.events}
            {categories}
            {date}
            on:event-click
            on:event-mouseover
            on:event-context
        />
    {:else}
        <Dots events={day.events} {categories} />
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
