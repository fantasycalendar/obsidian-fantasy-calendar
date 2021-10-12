<script lang="ts">
    import type { DayHelper } from "src/helper";
    import Dots from "./Dots.svelte";

    import { createEventDispatcher } from "svelte";
    import Flags from "./Flags.svelte";

    const dispatch = createEventDispatcher();

    export let day: DayHelper;
    export let adjacent: boolean;
    export let fullView: boolean;

    $: categories = day.calendar.object.categories;

    export let dayView: boolean = false;
    let today = day.isCurrentDay;
    let displaying = day.isDisplaying;

    $: {
        if (dayView) {
            displaying = day.isDisplaying;
        }
    }

    day.calendar.on("day-update", () => {
        today = day.isCurrentDay;
        displaying = day.isDisplaying;
    });
</script>

<div
    class:day={true}
    class:fantasy-day={true}
    class:active={today && !adjacent}
    class:viewing={dayView && displaying}
    class={adjacent ? "adjacent-month fantasy-adjacent-month" : ""}
    aria-label={day.events.length
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
        <Flags
            events={day.events}
            {categories}
            on:event-click
            on:event-mouseover
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
        overflow: hidden;
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
