<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Event, Month, EventCategory } from "src/@types";
    import { dateString } from "src/utils/functions";

    import Detail from "./Detail.svelte";
    import EventUI from "./Event.svelte";

    export let categories: EventCategory[] = [];
    export let events: Event[] = [];
    export let months: Month[] = [];

    const dispatch = createEventDispatcher();

    const editEvent = (item: Event) => {
        dispatch("new-item", item);
    };
    const deleteEvent = (item: Event) => {
        events = events.filter((event) => event.id !== item.id);
        dispatch("edit-events", events);
    };

    $: {
        events.sort((a, b) => {
            if (a.date.year != b.date.year) {
                return a.date.year - b.date.year;
            }
            if (a.date.month != b.date.month) {
                return a.date.month - b.date.month;
            }
            return a.date.day - b.date.day;
        });
    }
    const getCategory = (category: string) => {
        return categories.find(({ id }) => id == category);
    };
</script>

<Detail label="Event" on:new-item>
    {#if !events.length}
        <div class="existing-items">
            <span>Create a new event to see it here.</span>
        </div>
    {:else}
        <div class="existing-items">
            {#each events as event}
                <EventUI
                    {event}
                    category={getCategory(event.category)}
                    date={dateString(event.date, months, event.end)}
                    on:edit={() => editEvent(event)}
                    on:delete={() => deleteEvent(event)}
                />
            {/each}
        </div>
    {/if}
</Detail>

<style>
</style>
