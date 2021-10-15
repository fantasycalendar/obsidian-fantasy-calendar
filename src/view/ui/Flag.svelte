<script lang="ts">
    import { Platform, setIcon } from "obsidian";

    import type { Event, EventCategory } from "src/@types";
    import { DEFAULT_CATEGORY_COLOR } from "src/utils/constants";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let event: Event;

    export let dayView: boolean = false;
    export let categories: EventCategory[];

    let color =
        categories.find((c) => c.id == event.category)?.color ??
        DEFAULT_CATEGORY_COLOR;

    $: color =
        categories.find((c) => c.id == event.category)?.color ??
        DEFAULT_CATEGORY_COLOR;

    const meta = Platform.isMacOS ? "Meta" : "Control";

    const note = (node: HTMLElement) => {
        setIcon(node, "note-glyph");
    };
</script>

<div
    class="flag"
    aria-label={!dayView ? event.name : null}
    style="--hex-alpha: {color}40; --color:{color}"
    on:click={(evt) =>
        dispatch("event-click", {
            event,
            modifier: evt.getModifierState(meta)
        })}
    on:mouseover={(evt) =>
        dispatch("event-mouseover", { target: evt.target, event })}
    on:focus={() => {}}
    on:contextmenu={(evt) => dispatch("event-context", { evt: evt, event })}
>
    <span class:clamp={!dayView} class:day-view={dayView}> {event.name}</span>
    {#if event.note}
        <div class="note" use:note />
    {/if}
</div>

<style>
    .flag {
        cursor: pointer;

        display: flex;
        justify-content: space-between;
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
