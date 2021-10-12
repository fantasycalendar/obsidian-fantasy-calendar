<script lang="ts">
    import Flag from "./Flag.svelte";
    import type { Event, EventCategory } from "src/@types";

    export let events: Event[] = [];
    export let categories: EventCategory[];

    const MAX_EVENTS = 5;

    const color = (event: Event) => {
        return (
            categories.find((c) => c.id == event.category)?.color ?? "#808080"
        );
    };
</script>

<div>
    <div class="flag-container">
        {#each events.slice(0, MAX_EVENTS) as event}
            <Flag
                {event}
                color={color(event)}
                on:event-click
                on:event-mouseover
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
