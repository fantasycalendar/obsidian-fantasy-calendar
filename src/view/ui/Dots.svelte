<script lang="ts">
    import Dot from "./Dot.svelte";
    import type { Event, EventCategory } from "src/@types";

    export let centered: boolean = true;
    export let events: Event[] = [];
    export let categories: EventCategory[];

    const MAX_EVENTS = 3;
    const color = (event: Event) => {
        return categories.find((c) => c.id == event.category)?.color;
    };
</script>

<div>
    <div class="dot-container" class:centered>
        {#each events.slice(0, MAX_EVENTS) as event}
            <Dot color={color(event)} />
        {/each}
    </div>
    <div class="overflow">
        {#if events.length > MAX_EVENTS}
            <span>+{events.length - MAX_EVENTS}</span>
        {/if}
    </div>
</div>

<style>
    .dot-container {
        display: flex;
        flex-wrap: wrap;
        line-height: 6px;
        min-height: 6px;
    }
    .centered {
        justify-content: center;
    }
    .overflow {
        color: var(--text-muted);
        font-size: xx-small;
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
</style>
