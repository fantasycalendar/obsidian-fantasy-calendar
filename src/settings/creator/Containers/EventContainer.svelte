<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Event, Calendar } from "src/@types";
    import { dateString, nanoid } from "src/utils/functions";

    import EventInstance from "./EventInstance.svelte";
    import { ButtonComponent } from "obsidian";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";

    export let calendar: Calendar;
    $: categories = calendar.categories;
    $: events = calendar.events;
    $: months = calendar.static.months;

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

<AddNew />

{#if !events.length}
    <NoExistingItems message={"Create a new event to see it here."} />
{:else}
    <div class="existing-items">
        {#each events as event}
            <EventInstance
                {event}
                category={getCategory(event.category)}
                date={dateString(event.date, months, event.end)}
                on:edit={() => editEvent(event)}
                on:delete={() => deleteEvent(event)}
            />
        {/each}
    </div>
{/if}

<style>
</style>
