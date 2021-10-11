<script lang="ts">
    import { setIcon } from "obsidian";

    import type { Event } from "src/@types";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let event: Event;
    export let color: string;
    const note = (node: HTMLElement) => {
        setIcon(node, "note-glyph");
    };
</script>

<div
    class="flag"
    aria-label={event.name}
    style="--hex-alpha: {color}40; --color:{color}"
    on:click={() => dispatch("event-click", event)}
    on:mouseover={(evt) =>
        dispatch("event-mouseover", { target: evt.target, event })}
    on:focus={() => {}}
>
    {#if event.note}
        <div class="note" use:note />
    {/if}
    <span> {event.name}</span>
</div>

<style>
    .flag {
        display: flex;
        align-items: flex-start;
        padding-left: 0.125rem;
        text-align: left;
        overflow: hidden;
        /* white-space: nowrap; */
        text-overflow: ellipsis;
        width: 100%;

        background-color: var(--hex-alpha);
        border-left: 2px solid var(--color);
    }
    .note {
        display: flex;
        margin-top: 0.2em;
    }
</style>
