<script lang="ts">
    import { Platform, setIcon } from "obsidian";

    import type { FcDate, Event, EventCategory } from "src/@types";
    import { DEFAULT_CATEGORY_COLOR } from "src/utils/constants";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let event: Event;
    export let date: FcDate;

    export let dayView: boolean = false;
    let multi = false,
        start = false,
        end = false,
        first = false;
    $: {
        if (event.end != undefined && !dayView) {
            multi = true;
            start =
                date.day === event.date.day &&
                (event.date.month == undefined ||
                    date.month == event.date.month) &&
                (event.date.year == undefined || date.year === event.date.year);
            first = start || date.day == 1;
            end =
                date.day === event.end.day &&
                (event.end.month == undefined ||
                    date.month == event.end.month) &&
                (event.end.year == undefined || date.year === event.end.year);
            if (start && end) {
                multi = false;
                start = false;
                end = false;
            }
        }
    }

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
    class:multi
    class:start
    class:end
    class:first
    class:day-view={dayView}
    aria-label={!dayView ? event.name : null}
    style="--hex-alpha: {color}40; --color:{color}"
    on:click={(evt) => {
        evt.stopPropagation();
        dispatch("event-click", {
            event,
            modifier: evt.getModifierState(meta)
        });
    }}
    on:mouseover={(evt) =>
        dispatch("event-mouseover", { target: evt.target, event })}
    on:focus={() => {}}
    on:contextmenu={(evt) => {
        evt.stopPropagation();
        dispatch("event-context", { evt: evt, event });
    }}
>
    <div class="flag-content">
        <span class:clamp={!dayView} class:day-view={dayView}>
            {event.name}</span
        >
        {#if event.note}
            <div class="note" use:note />
        {/if}
    </div>
</div>

<style>
    .flag {
        cursor: pointer;
        position: relative;
        padding-left: 0.125rem;
        text-align: left;
        width: 100%;

        background-color: var(--hex-alpha);
        border-left: 2px solid var(--color);
    }
    .flag-content {
        display: flex;
        gap: 0.25rem;
        align-items: flex-start;
        justify-content: space-between;
    }
    .day-view .flag-content {
        justify-content: space-between;
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
    .multi {
        flex-shrink: 0;
        overflow: visible;
        width: unset;
    }
    .multi .clamp {
        -webkit-line-clamp: 1;
        overflow: visible;
    }
    .multi.start {
        margin-left: 0;
    }
    .multi.end {
        margin-right: 0;
    }
    .multi.first {
        overflow: visible;
        white-space: nowrap;
    }
    .multi:not(.first) {
        color: transparent;
        overflow: hidden;
    }
    .multi:not(.start) {
        border: 0;
        margin-left: -6px;
    }
    .multi:not(.end) {
        margin-right: -6px;
    }
    .start > .flag-content {
        justify-content: flex-start;
        gap: 1em;
    }
</style>
