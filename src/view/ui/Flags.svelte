<script lang="ts">
    import Flag from "./Flag.svelte";
    import type { Event, EventCategory } from "src/@types";
import { DEFAULT_CATEGORY_COLOR } from "src/utils/constants";

    export let events: Event[] = [];
    export let categories: EventCategory[];
    export let dayView: boolean = false;

    const MAX_EVENTS = dayView ? Infinity : 5;

    const color = (event: Event) => {
        return (
            categories.find((c) => c.id == event.category)?.color ?? DEFAULT_CATEGORY_COLOR
        );
    };
</script>

<div>
    <div class="flag-container">
        {#each events.slice(0, MAX_EVENTS) as event}
            <Flag
                {event}
                color={color(event)}
                {dayView}
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
