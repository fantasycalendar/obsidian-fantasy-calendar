<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import {
        ButtonComponent,
        debounce,
        ExtraButtonComponent,
        Notice,
        setIcon,
        TextComponent
    } from "obsidian";
    import type { Month } from "src/@types";

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

    const trash = (node: HTMLElement, item: Month) => {
        new ExtraButtonComponent(node)
            .setIcon("trash")
            .onClick(
                () => (months = months.filter((day) => day.id !== item.id))
            );
    };

    const name = (node: HTMLElement, item: Month) => {
        const comp = new TextComponent(node)
            .setValue(item.name)
            .setPlaceholder("Name")
            .onChange((v) => {
                item.name = v;
                dispatch("month-update", months);
            });
        comp.inputEl.setAttr("style", "width: 100%;");
    };

    const length = (node: HTMLElement, item: Month) => {
        const comp = new TextComponent(node)
            .setValue(`${item.length}`)
            .setPlaceholder("Length")
            .onChange(
                debounce(
                    (v) => {
                        if (isNaN(Number(v)) || Number(v) < 0) {
                            new Notice(
                                "Month length must be a positive number."
                            );
                            comp.inputEl.value = null;
                            return;
                        }
                        item.length = Number(v);
                        dispatch("month-update", months);
                    },
                    500,
                    true
                )
            );
        comp.inputEl.setAttr("style", "width: 100%;");
        comp.inputEl.setAttrs({ type: "number", min: "0" });
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
    $: {
        dispatch("month-update", months);
    }
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
            {#each months as item (item.id)}
                <div animate:flip={{ duration: flipDurationMs }} class="month">
                    <div
                        class="icon"
                        use:grip
                        on:mousedown={startDrag}
                        on:touchstart={startDrag}
                    />

                    <div use:name={item} />
                    <div use:length={item} />

                    <div class="icon" use:trash={item} />
                </div>
            {/each}
        </div>
    {/if}
</Detail>

<style>
    .month {
        display: grid;
        grid-template-columns: auto 1fr 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .month .icon {
        align-items: center;
    }
    .month {
        margin-top: 0.5rem;
    }
</style>
