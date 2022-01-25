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

    export let firstWeekday: number = 0;
    export let overflow: boolean = true;

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

    const dispatch = createEventDispatcher();
    export let calendar: Calendar;

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
            }).buttonEl.style.width = "100%";
    };
</script>

<div>
    <div class="overflow" use:overflowNode />
</div>
<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">First Day</div>
        <div class="setting-item-description">
            The first day of the first year.
        </div>
    </div>
    <div class="setting-item-control">
        <select
            class="dropdown"
            bind:value={firstWeekday}
            aria-label={!overflow
                ? "Cannot be modified without overflow."
                : undefined}
        >
            {#each weekdays as weekday, index}
                <option
                    disabled={!overflow}
                    value={index}
                    selected={index == firstWeekday}
                    >{weekday.name ?? ""}</option
                >
            {/each}
        </select>
    </div>
</div>

<div>
    <div class="add-new" use:add />
</div>
{#if !weekdays.length}
    <div class="existing-items">
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
    .overflow {
        padding-top: 0.75rem;
    }
    .weekday {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .weekday .icon {
        align-items: center;
    }
    .weekday {
        margin-top: 0.5rem;
    }
</style>
