<script lang="ts">
    import Flag from "./Flag.svelte";
    import type { CurrentCalendarData, Event, EventCategory } from "src/@types";
    import { createEventDispatcher, onMount, tick } from "svelte";
    import CalendarHelper from "src/helper";

    export let events: Event[] = [];
    export let categories: EventCategory[];
    export let dayView: boolean = false;
    export let date: CurrentCalendarData;
    export let calendar: CalendarHelper;

    $: events = events;

    let container: HTMLDivElement;
    let flags: HTMLDivElement;
    let overflow: number = 0;
    const dispatch = createEventDispatcher();

    const addEvents = async () => {
        overflow = 0;
        if (events.length) {
            flags.empty();
            const height = container.getBoundingClientRect().height;
            let remaining = height;

            const clone = [...events];

            while ((remaining > 0 || dayView) && clone.length) {
                const flag = new Flag({
                    target: flags,
                    props: {
                        event: clone.shift(),
                        categories,
                        dayView,
                        date
                    }
                });
                flag.$on("event-click", (e) =>
                    dispatch("event-click", e.detail)
                );
                flag.$on("event-mouseover", (e) =>
                    dispatch("event-mouseover", e.detail)
                );
                flag.$on("event-context", (e) =>
                    dispatch("event-context", e.detail)
                );
                remaining = height - flags.getBoundingClientRect().height;

                if (remaining < 0 && !dayView) {
                    flags.lastElementChild.detach();
                    overflow = clone.length + 1;
                }
            }
        }
    };

    $: {
        if (events && container && flags) {
            addEvents();
        }
    }

    calendar.on("view-resized", () => {
        if (dayView) return;
        addEvents();
    });

    onMount(addEvents);
</script>

<div class="flags-container" bind:this={container}>
    <div class="flag-container" bind:this={flags}>
        <!-- {#each events.slice(0, MAX_EVENTS) as event}
            <Flag
                {event}
                {categories}
                {dayView}
                {date}
                on:event-click
                on:event-mouseover
                on:event-context
            />
        {/each} -->
    </div>
    <div class="overflow">
        {#if overflow > 0}
            <span>+{overflow}</span>
        {/if}
    </div>
</div>

<style>
    .flags-container {
        height: 100%;
    }
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
