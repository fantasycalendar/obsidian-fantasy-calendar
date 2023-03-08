<script lang="ts">
    import type { Event, Calendar } from "src/@types";
    import { dateString } from "src/utils/functions";

    import EventInstance from "./EventInstance.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import type FantasyCalendar from "src/main";
    import { CreateEventModal } from "src/settings/modals/event/event";
    import Details from "../Utilities/Details.svelte";
    import ButtonComponent from "../Settings/ButtonComponent.svelte";
    import { confirmWithModal } from "src/settings/modals/confirm";
    import {
        Setting,
        prepareFuzzySearch,
        FuzzyMatch,
        debounce,
        SearchComponent
    } from "obsidian";
    import { getContext } from "svelte";
    import { derived, writable } from "svelte/store";

    export let plugin: FantasyCalendar;

    const calendar = getContext("store");
    const { eventStore, monthStore } = calendar;
    const { sortedStore } = eventStore;

    const slicer = writable(1);
    let filtered = false;
    let nameFilter = writable<string>("");

    const sorted = derived([sortedStore, nameFilter], ([events, filter]) => {
        if (!filter || !filter.length) {
            filtered = false;
            return events;
        }
        const results = [];
        for (const event of events) {
            const result = prepareFuzzySearch(filter)(event.name);
            if (result) {
                results.push(event);
            }
        }
        filtered = true;
        return results;
    });

    const sliced = derived([sorted, slicer], ([events, slicer]) =>
        events.slice(0, 100 * slicer)
    );

    const deleteEvent = (item: Event) => {
        eventStore.delete(item.id);
    };
    const getCategory = (category: string) => {
        return $calendar.categories.find(({ id }) => id == category);
    };
    const add = (event?: Event) => {
        const modal = new CreateEventModal(plugin, $calendar, event);
        modal.onClose = () => {
            if (!modal.saved) return;
            if (modal.editing) {
                eventStore.update(event.id, { ...modal.event });
            } else {
                eventStore.add({ ...modal.event });
            }
        };
        modal.open();
    };
    const deleteAll = async () => {
        if (
            await confirmWithModal(
                plugin.app,
                "Are you sure you want to delete all events from this calendar?"
            )
        ) {
            eventStore.set([]);
        }
    };
    const filter = (node: HTMLElement) => {
        node.createDiv();
        let search: SearchComponent;
        new Setting(node)
            .setName("Filter events")
            .addSearch((s) => {
                search = s;
                s.onChange(
                    debounce((v) => {
                        $nameFilter = v;
                    }, 250)
                );
            })
            .addExtraButton((b) => {
                b.setIcon("trash")
                    .setTooltip("Delete Filtered Events")
                    .onClick(async () => {
                        if (
                            await confirmWithModal(
                                plugin.app,
                                "Are you sure you want to delete the filtered events from this calendar?"
                            )
                        ) {
                            eventStore.set(
                                $eventStore.filter((e) => !$sorted.includes(e))
                            );
                            search.setValue("");
                            $nameFilter = "";
                        }
                    });
            });
    };
</script>

<Details
    name={"Events"}
    desc={`Displaying ${$sorted.length}/${$calendar.events.length} events.`}
    open={false}
>
    <ButtonComponent
        name={"Delete All Events"}
        icon="trash"
        on:click={() => deleteAll()}
    />
    <div class="filter" use:filter />
    <AddNew on:click={() => add()} />
    <div class="existing-items">
        {#each $sliced as event}
            <EventInstance
                {event}
                category={getCategory(event.category)}
                date={dateString(event.date, $monthStore, event.end)}
                on:edit={() => add(event)}
                on:delete={() => deleteEvent(event)}
            />
        {:else}
            <div />
            <div class="setting-item">
                <NoExistingItems
                    message={"Create a new event to see it here."}
                />
            </div>
        {/each}
    </div>
    {#if !filtered && $sliced.length < $eventStore.length}
        <div class="more" on:click={() => $slicer++}>
            <small>Load More Events...</small>
        </div>
    {/if}
</Details>

<style>
    .more {
        text-align: center;
        padding-top: 10px;
        text-decoration: underline;
        font-style: italic;
        cursor: pointer;
    }
</style>
