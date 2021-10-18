<script lang="ts">
    import Flag from "./Flag.svelte";
    import type { CurrentCalendarData, Event, EventCategory } from "src/@types";

    export let events: Event[] = [];
    export let categories: EventCategory[];
    export let dayView: boolean = false;
    export let date: CurrentCalendarData;

    $: events = events;

    const MAX_EVENTS = dayView ? Infinity : 5;
</script>

<div>
    <div class="flag-container">
        {#each events.slice(0, MAX_EVENTS) as event}
            <Flag
                {event}
                {categories}
                {dayView}
                {date}
                on:event-click
                on:event-mouseover
                on:event-context
            />
        {/each}
    </div>
    <div class="overflow">
        {#if events.length > MAX_EVENTS}
            <span>+{events.length - MAX_EVENTS}</span>
        {/if}
    </div>
</div>

<style>
    .flag-container {
        display: flex;
        flex-flow: column nowrap;
        gap: 0.25rem;
    }

    .overflow {
        color: var(--text-muted);
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
</style>
