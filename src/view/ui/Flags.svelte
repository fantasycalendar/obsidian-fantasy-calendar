<script lang="ts">
    import Flag from "./Flag.svelte";
    import type { Event } from "src/@types";
    export let events: Event[] = [];

    const MAX_EVENTS = 5;
</script>

<div>
    <div class="flag-container">
        {#each events.slice(0, MAX_EVENTS) as event}
            <Flag {event} />
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
        gap: 0.125rem;
    }

    .overflow {
        color: var(--text-muted);

        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
</style>
