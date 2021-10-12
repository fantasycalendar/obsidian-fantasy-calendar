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
    <span class="clamp"> {event.name}</span>
    {#if event.note}
        <div class="note" use:note />
    {/if}
</div>

<style>
    .flag {
        display: flex;
        align-items: flex-start;
        padding-left: 0.125rem;
        text-align: left;
        width: 100%;

        background-color: var(--hex-alpha);
        border-left: 2px solid var(--color);
    }

    .clamp {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .note {
        display: flex;
        align-self: center;
    }
</style>
