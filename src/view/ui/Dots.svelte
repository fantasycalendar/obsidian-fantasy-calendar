<script lang="ts">
    import Dot from "./Dot.svelte";
    import type { Event, EventCategory } from "src/@types";
    import { createEventDispatcher, onMount } from "svelte";
    import CalendarHelper from "src/helper";

    export let events: Event[] = [];
    export let categories: EventCategory[];
    export let calendar: CalendarHelper;

    let container: HTMLDivElement;
    let dots: HTMLDivElement;
    let overflow: number = 0;
    const dispatch = createEventDispatcher();

    const addEvents = async () => {
        overflow = 0;
        if (events.length) {
            dots.empty();
            const width = container.getBoundingClientRect().width;

            let remaining = width;

            for (const event of events) {
                new Dot({
                    target: dots,
                    props: {
                        color: color(event)
                    }
                });
                remaining = width - dots.getBoundingClientRect().width;

                if (remaining < 0) {
                    dots.lastElementChild.detach();
                    overflow = events.length - events.indexOf(event);
                    break;
                } else if (remaining == 0) {
                    overflow = events.length - events.indexOf(event) - 1;
                    break;
                }
            }
        }
    };

    $: {
        if (events && container && dots) {
            addEvents();
        }
    }

    calendar.on("view-resized", () => {
        if (!container || !dots) return;
        addEvents();
    });

    onMount(addEvents);
    const color = (event: Event) => {
        return categories.find((c) => c.id == event.category)?.color;
    };
</script>

<div class="dots-container" bind:this={container}>
    <div class="dot-container centered" bind:this={dots} />
    <div class="overflow">
        {#if overflow > 0}
            <span>+{overflow}</span>
        {/if}
    </div>
</div>

<style>
    .dots-container {
        width: 100%;
    }
    .dot-container {
        display: flex;
        flex-flow: row nowrap;
        width: fit-content;
        margin: auto;
        line-height: 6px;
        min-height: 6px;
    }
    .centered {
        justify-content: center;
        align-items: center;
    }
    .overflow {
        color: var(--text-muted);
        font-size: xx-small;
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
</style>
