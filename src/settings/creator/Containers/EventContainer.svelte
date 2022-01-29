<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Event, Calendar } from "src/@types";
    import { dateString } from "src/utils/functions";

    import EventInstance from "./EventInstance.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import type FantasyCalendar from "src/main";
    import { CreateEventModal } from "src/settings/modals/event";

    export let calendar: Calendar;
    export let plugin: FantasyCalendar;
    $: events = calendar.events;
    $: months = calendar.static.months;

    const deleteEvent = (item: Event) => {
        events = events.filter((event) => event.id !== item.id);
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
        return calendar.categories.find(({ id }) => id == category);
    };
    const add = (event?: Event) => {
        const modal = new CreateEventModal(plugin.app, calendar, event);
        modal.onClose = () => {
            if (!modal.saved) return;
            if (modal.editing) {
                const index = calendar.events.findIndex(
                    (e) => e.id === modal.event.id
                );

                calendar.events.splice(index, 1, { ...modal.event });
            } else {
                calendar.events.push({ ...modal.event });
            }
            events = calendar.events;
        };
        modal.open();
    };
</script>

<AddNew on:click={() => add()} />

{#if !events.length}
    <NoExistingItems message={"Create a new event to see it here."} />
{:else}
    <div class="existing-items">
        {#each events as event}
            <EventInstance
                {event}
                category={getCategory(event.category)}
                date={dateString(event.date, months, event.end)}
                on:edit={() => add(event)}
                on:delete={() => deleteEvent(event)}
            />
        {/each}
    </div>
{/if}

<style>
</style>
