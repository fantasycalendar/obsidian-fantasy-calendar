<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { ButtonComponent, ExtraButtonComponent } from "obsidian";

    import type { Event, Month, EventCategory } from "src/@types";
    import { dateString } from "src/utils/functions";
    import Dot from "./Dot.svelte";
    import Detail from "./Detail.svelte";

    export let categories: EventCategory[] = [];
    export let events: Event[] = [];
    export let months: Month[] = [];

    const dispatch = createEventDispatcher();

    const add = (node: HTMLElement) => {
        const b = new ButtonComponent(node)
            .setTooltip("Add Event")
            .setButtonText("+")
            .onClick(async () => {
                dispatch("new-event");
            });
        b.buttonEl.style.width = "100%";
    };
    const trash = (node: HTMLElement) => {
        let b = new ExtraButtonComponent(node)
            .setIcon("trash")
            .setTooltip("Delete");
        b.extraSettingsEl.setAttr("style", "margin-left: 0;");
    };
    const edit = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("pencil").setTooltip("Edit");
    };
    const editEvent = (item: Event) => {
        dispatch("new-event", item);
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
        return categories.find(({ name }) => name == category);
    };
</script>

<Detail label="Event">
    {#if !events.length}
        <div class="existing-items">
            <span>Create a new event to see it here.</span>
        </div>
    {:else}
        <div class="existing-items">
            {#each events as event, index}
                <div class="event">
                    <div class="event-info">
                        <span class="setting-item-name">
                            {#if event.category && getCategory(event.category) != null}
                                <Dot
                                    color={getCategory(event.category)?.color}
                                    label={getCategory(event.category)?.name}
                                />
                            {/if}
                            {event.name}
                        </span>
                        <div class="setting-item-description">
                            <div class="date">
                                {dateString(event, months)}
                            </div>
                            <span class="clamp">{event.description ?? ""}</span>
                        </div>
                    </div>

                    <div class="icons">
                        <div
                            class="icon"
                            use:edit
                            on:click={() => editEvent(event)}
                        />
                        <div
                            class="icon"
                            use:trash
                            on:click={() => deleteEvent(event)}
                        />
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</Detail>

<style>
    .event {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    .event-info {
        width: 100%;
    }

    .event .icon {
        align-items: center;
    }

    .icons {
        display: flex;
        align-self: flex-start;
        justify-self: flex-end;
        align-items: center;
    }

    .event {
        margin-top: 0.5rem;
    }
    .add-new {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;

        display: flex;
        width: 100%;
    }
    .date {
        display: flex;
        justify-content: flex-start;
        gap: 0.25rem;
    }
    .clamp {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        word-break: keep-all;
        overflow: hidden;
        width: calc(var(--event-max-width) * 0.75);
    }
</style>
