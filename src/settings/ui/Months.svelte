<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import {
        ButtonComponent,
        debounce,
        DropdownComponent,
        ExtraButtonComponent,
        Notice,
        setIcon,
        TextComponent
    } from "obsidian";
    import type { Month } from "src/@types";

    import MonthInstance from "./Month.svelte";

    import { nanoid } from "src/utils/functions";
    import Detail from "./Detail.svelte";

    const addNew = () => {
        months = [
            ...months,
            {
                type: "month",
                name: null,
                length: null,
                id: nanoid(6)
            }
        ];
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
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }

    const dispatch = createEventDispatcher();

    export let months: Month[] = [];
</script>

<Detail label="Months" on:new-item={addNew}>
    {#if !months.length}
        <div class="existing-items">
            <span>Create a new month to see it here.</span>
        </div>
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
                    <MonthInstance {month} on:mousedown={startDrag} />
                </div>
            {/each}
        </div>
    {/if}
</Detail>

<style>
    .month {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        gap: 1rem;
    }
</style>
