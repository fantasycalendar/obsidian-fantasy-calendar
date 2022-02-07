<script lang="ts">
    import type { Event, Calendar } from "src/@types";
    import { dateString } from "src/utils/functions";

    import EventInstance from "./EventInstance.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import type FantasyCalendar from "src/main";
    import { CreateEventModal } from "src/settings/modals/event";
    import Details from "../Utilities/Details.svelte";
    import ButtonComponent from "../Settings/ButtonComponent.svelte";

    export let calendar: Calendar;
    export let plugin: FantasyCalendar;
    let sliced = 1;
    $: sorted = calendar.events.sort((a, b) => {
        if (a.date.year != b.date.year) {
            return a.date.year - b.date.year;
        }
        if (a.date.month != b.date.month) {
            return a.date.month - b.date.month;
        }
        return a.date.day - b.date.day;
    });
    $: events = sorted.slice(0, 25 * sliced);
    $: months = calendar.static.months;

    const deleteEvent = (item: Event) => {
        events = events.filter((event) => event.id !== item.id);
    };
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

<Details name={"Events"}>
    {#if !events.length}
        <AddNew on:click={() => add()} />
        <NoExistingItems message={"Create a new event to see it here."} />
    {:else}
        <ButtonComponent name="Delete All Events" icon="trash" />
        <AddNew on:click={() => add()} />
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
        <div class="more" on:click={() => sliced++}>Load More Events...</div>
    {/if}
</Details>

<style>
</style>
