<script lang="ts">
    import type { DayHelper } from "src/calendar";
    import Dots from "./Dots.svelte";

    import { createEventDispatcher } from "svelte";
    import Flags from "./Flags.svelte";

    const dispatch = createEventDispatcher();

    export let day: DayHelper;
    export let adjacent: boolean;
    export let fullView: boolean;

    const contextMenu = (evt: MouseEvent) => {
        dispatch("day-context-menu", { day, evt });
    };
</script>

<div
    class:day={true}
    class:fantasy-day={true}
    class:active={day.isCurrentDay && !adjacent}
    class={adjacent ? "adjacent-month fantasy-adjacent-month" : ""}
    aria-label={day.events.length
        ? `${day.events.length} event${day.events.length == 1 ? "" : "s"}`
        : undefined}
    on:click={() => dispatch("day-click", day)}
    on:contextmenu={contextMenu}
>
    <span>
        {day.number}
    </span>
    {#if fullView}
        <Flags events={day.events} />
    {:else}
        <Dots events={day.events} />
    {/if}
</div>

<style>
    .day {
        background-color: var(--color-background-day);
        border-radius: 4px;
        color: var(--color-text-day);
        cursor: pointer;
        font-size: 0.8em;
        height: 100%;
        padding: 4px;
        position: relative;
        text-align: center;
        vertical-align: baseline;
        overflow: hidden;
    }
    .adjacent-month {
        opacity: 0.25;
    }
</style>
