<script lang="ts">
    import { getContext } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import { setIcon } from "obsidian";
    import type { Month } from "src/@types";

    import MonthInstance from "./MonthInstance.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import Details from "../Utilities/Details.svelte";

    const store = getContext("store");
    const { monthStore } = store;

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
        monthStore.set(newItems);
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
        monthStore.set(newItems);
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }
</script>

<Details
    name={"Months"}
    warn={!$monthStore?.length}
    label={"At least one month is required"}
    desc={`${$monthStore.length} month${$monthStore.length != 1 ? "s" : ""}`}
    open={false}
>
    <AddNew on:click={() => monthStore.add()} />

    {#if !$monthStore.length}
        <NoExistingItems message={"Create a new month to see it here."} />
    {:else}
        <div
            use:dndzone={{ items: $monthStore, flipDurationMs, dragDisabled }}
            class="existing-items"
            on:consider={handleConsider}
            on:finalize={handleFinalize}
        >
            {#each $monthStore as month (month.id)}
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
</Details>

<style>
    .month {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        gap: 1rem;
    }
</style>
