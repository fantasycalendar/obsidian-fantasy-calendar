<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import {
        ButtonComponent,
        ExtraButtonComponent,
        setIcon,
        Setting,
        TextComponent
    } from "obsidian";
    import type { Calendar, Day } from "src/@types";

    import { nanoid } from "src/utils/functions";
    import { getDetachedSetting } from "../utils";
    import ToggleComponent from "./Settings/ToggleComponent.svelte";
    import DropdownComponent from "./Settings/DropdownComponent.svelte";

    const dispatch = createEventDispatcher();
    export let calendar: Calendar;
    export let firstWeekday: number = 0;
    export let overflow: boolean = true;

    $: weekdays = calendar.static.weekdays;

    $: {
        dispatch("weekday-update", weekdays);
    }

    $: {
        dispatch("first-weekday-update", firstWeekday);
    }

    $: {
        dispatch("overflow-update", overflow);
    }
    const grip = (node: HTMLElement) => {
        setIcon(node, "fantasy-calendar-grip");
    };

    const trash = (node: HTMLElement, item: Day) => {
        new ExtraButtonComponent(node)
            .setIcon("trash")
            .onClick(
                () => (weekdays = weekdays.filter((day) => day.id !== item.id))
            );
    };
    function startDrag(e: Event) {
        e.preventDefault();
        dragDisabled = false;
    }
    const flipDurationMs = 300;
    let dragDisabled = false;

    function handleConsider(e: CustomEvent<GenericDndEvent<Day>>) {
        const {
            items: newItems,
            info: { source, trigger }
        } = e.detail;
        weekdays = newItems;
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            dragDisabled = true;
        }
    }
    function handleFinalize(e: CustomEvent<GenericDndEvent<Day>>) {
        const {
            items: newItems,
            info: { source }
        } = e.detail;
        weekdays = newItems;
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }

    const name = (node: HTMLElement, item: Day) => {
        new TextComponent(node)
            .setValue(item.name)
            .setPlaceholder("Name")
            .onChange((v) => {
                item.name = v;
                dispatch("weekday-update", weekdays);
                weekdays = weekdays;
            })
            .inputEl.setAttr("style", "width: 100%;");
    };

    const overflowNode = (node: HTMLElement) => {
        getDetachedSetting(node)
            .setName("Overflow Weeks")
            .setDesc(
                "Turn this off to make each month start on the first of the week."
            )
            .addToggle((t) => {
                t.setValue(overflow).onChange((v) => {
                    overflow = v;
                });
            });
    };

    const add = (node: HTMLElement) => {
        new ButtonComponent(node)
            .setTooltip("Add New")
            .setButtonText("+")
            .onClick(async () => {
                calendar.static.weekdays = [
                    ...weekdays,
                    {
                        type: "day",
                        name: null,
                        id: nanoid(6)
                    }
                ];
            });
    };
</script>

<ToggleComponent
    name={"Overflow Weeks"}
    desc={"Turn this off to make each month start on the first of the week."}
    value={calendar.static.overflow}
    on:click={() => (calendar.static.overflow = !calendar.static.overflow)}
/>

<DropdownComponent
    name="First Day"
    desc={"The day of the week the first year starts on."}
    value={"test"}
/>

<div class="add-new setting-item" use:add />

{#if !weekdays.length}
    <div class="no-existing-items setting-item">
        <span>Create a new weekday to see it here.</span>
    </div>
{:else}
    <div
        use:dndzone={{ items: weekdays, flipDurationMs, dragDisabled }}
        class="existing-items"
        on:consider={handleConsider}
        on:finalize={handleFinalize}
    >
        {#each weekdays as item (item.id)}
            <div animate:flip={{ duration: flipDurationMs }} class="weekday">
                <div
                    class="icon"
                    use:grip
                    on:mousedown={startDrag}
                    on:touchstart={startDrag}
                />

                <div use:name={item} />

                <div class="icon" use:trash={item} />
            </div>
        {/each}
    </div>
{/if}

<style>
    .add-new,
    .add-new :global(button) {
        width: 100%;
    }

    .no-existing-items span {
        width: 100%;
        text-align: center;
        color: var(--text-faint);
    }
    .existing-items {
        width: 100%;
    }

    .weekday {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
    }

    .weekday .icon {
        align-items: center;
    }
    .weekday {
        margin-top: 0.5rem;
    }
</style>
