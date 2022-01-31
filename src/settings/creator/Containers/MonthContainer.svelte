<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import { ButtonComponent, setIcon } from "obsidian";
    import type { Calendar, Month } from "src/@types";

    import MonthInstance from "./MonthInstance.svelte";

    import { nanoid } from "src/utils/functions";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import { Writable } from "svelte/store";

    let calendar: Calendar;

    const store = getContext<Writable<Calendar>>("store");
    store.subscribe((v) => (calendar = v));

    $: months = calendar.static.months;

    const deleteMonth = (month: Month) => {
        months = months.filter((m) => m.id != month.id);

        store.set(calendar);
    };
    const grip = (node: HTMLElement) => {
        setIcon(node, "fantasy-calendar-grip");
    };

    function startDrag(e: Event) {
        // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
        e.preventDefault();
        dragDisabled = false;
    }
    const flipDurationMs = 300;
    let dragDisabled = false;

    function handleConsider(e: CustomEvent<GenericDndEvent<Month>>) {
        const {
            items: newItems,
            info: { source, trigger }
        } = e.detail;
        months = newItems;
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            dragDisabled = true;
        }
    }
    function handleFinalize(e: CustomEvent<GenericDndEvent<Month>>) {
        const {
            items: newItems,
            info: { source }
        } = e.detail;
        months = newItems;
        dispatch("month-update", months);
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }

    const dispatch = createEventDispatcher();

    const add = () => {
        calendar.static.months = [
            ...months,
            {
                type: "month",
                name: null,
                length: null,
                id: nanoid(6)
            }
        ];
        store.set(calendar);
    };
</script>

<AddNew on:click={() => add()} />

{#if !months.length}
    <NoExistingItems message={"Create a new month to see it here."} />
{:else}
    <div
        use:dndzone={{ items: months, flipDurationMs, dragDisabled }}
        class="existing-items"
        on:consider={handleConsider}
        on:finalize={handleFinalize}
    >
        {#each months as month (month.id)}
            <div animate:flip={{ duration: flipDurationMs }} class="month">
                <div
                    class="icon"
                    use:grip
                    on:mousedown={startDrag}
                    on:touchstart={startDrag}
                />
                <MonthInstance
                    {month}
                    on:mousedown={startDrag}
                    on:month-delete={() => deleteMonth(month)}
                    on:month-update={() => {
                        store.set(calendar);
                    }}
                />
            </div>
        {/each}
    </div>
{/if}

<style>
    .month {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        gap: 1rem;
    }
</style>
