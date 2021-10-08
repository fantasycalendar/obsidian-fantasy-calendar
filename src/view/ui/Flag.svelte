<script lang="ts">
    import type { Event } from "src/@types";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let event: Event;
    export let color: string = "#808080";
</script>

<div
    class="flag"
    aria-label={event.name}
    style="--hex-alpha: {color}40; --color:{color}"
    on:click={() => dispatch("event-click", event)}
>
    <span>{event.name} </span>
</div>

<style>
    .flag {
        padding-left: 0.125rem;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;

        background-color: var(--hex-alpha);
        border-left: 2px solid var(--color);
    }
</style>
