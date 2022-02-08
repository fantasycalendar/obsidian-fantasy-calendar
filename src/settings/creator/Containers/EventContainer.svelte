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
    import { confirmWithModal } from "src/settings/modals/confirm";
    import {
        Setting,
        prepareFuzzySearch,
        FuzzyMatch,
        debounce,
        SearchComponent
    } from "obsidian";

    export let calendar: Calendar;
    export let plugin: FantasyCalendar;
    let sliced = 1;
    let filtered = false;
    $: sorted = calendar.events.sort((a, b) => {
        if (a.date.year != b.date.year) {
            return a.date.year - b.date.year;
        }
        if (a.date.month != b.date.month) {
            return a.date.month - b.date.month;
        }
        return a.date.day - b.date.day;
    });
    $: events = sorted.slice(0, 100 * sliced);
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
    const deleteAll = async () => {
        if (
            await confirmWithModal(
                plugin.app,
                "Are you sure you want to delete all events from this calendar?"
            )
        ) {
            calendar.events = [];
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
                        if (!v) {
                            sorted = calendar.events.sort((a, b) => {
                                if (a.date.year != b.date.year) {
                                    return a.date.year - b.date.year;
                                }
                                if (a.date.month != b.date.month) {
                                    return a.date.month - b.date.month;
                                }
                                return a.date.day - b.date.day;
                            });
                            filtered = false;
                            return;
                        }
                        const results = [];
                        for (const event of sorted) {
                            const result = prepareFuzzySearch(v)(event.name);
                            if (result) {
                                results.push(event);
                            }
                        }
                        console.log(results.filter((r) => r));
                        sorted = results;
                        filtered = true;
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
                            calendar.events = calendar.events.filter(
                                (e) => !sorted.includes(e)
                            );
                            search.setValue("");
                        }
                    });
            });
    };
</script>

<Details
    name={"Events"}
    desc={`Displaying ${events.length}/${calendar.events.length} events.`}
>
    <ButtonComponent
        name={"Delete All Events"}
        icon="trash"
        on:click={() => deleteAll()}
    />
    <div class="filter" use:filter />
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
        {:else}
            <div />
            <div class="setting-item">
                <NoExistingItems
                    message={"Create a new event to see it here."}
                />
            </div>
        {/each}
    </div>
    {#if !filtered && events.length < calendar.events.length}
        <div class="more" on:click={() => sliced++}>
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
