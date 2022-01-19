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

    $: events = [...events];

    let overflow: number = 0;
    const dispatch = createEventDispatcher();
    let flagContainer: HTMLElement;
    const addEvents = (flags: HTMLElement) => {
        flagContainer = flags;
        flags.empty();
        overflow = 0;
        if (events.length) {
            flags.empty();
            const height = flags.parentElement.getBoundingClientRect().height;
            let remaining = height;

            console.log("🚀 ~ file: Flags.svelte ~ line 28 ~ events", events);
            for (const event of events) {
                console.log("🚀 ~ file: Flags.svelte ~ line 30 ~ event", event);
                const flag = new Flag({
                    target: flags,
                    props: {
                        event,
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
                if (!dayView) {
                    remaining = height - flags.getBoundingClientRect().height;
                    if (remaining < 0) {
                        flags.lastElementChild.detach();
                        overflow = events.length - events.indexOf(event);
                        break;
                    } else if (remaining == 0) {
                        overflow = events.length - events.indexOf(event) - 1;
                        break;
                    }
                }
            }
        }
    };

    /* $: {
        if (events && container && flags) {
            addEvents();
        }
    } */

    calendar.on("view-resized", () => {
        if (dayView) return;
        addEvents(flagContainer);
    });

    /* onMount(addEvents); */
</script>

<div class="flags-container">
    {#key events}
        <div class="flag-container" use:addEvents>
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
    {/key}
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
