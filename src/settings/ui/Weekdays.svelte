<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import {
        ButtonComponent,
        DropdownComponent,
        ExtraButtonComponent,
        setIcon,
        Setting,
        TextComponent
    } from "obsidian";
    import type { Day } from "src/@types";

    import { nanoid } from "src/utils/functions";
    export let firstWeekday: number = 0;

    const add = (node: HTMLElement) => {
        new ButtonComponent(node)
            .setTooltip("Add Weekday")
            .setButtonText("+")
            .onClick(async () => {
                weekdays = [
                    ...weekdays,
                    {
                        type: "day",
                        name: null,
                        id: nanoid(6)
                    }
                ];
            });
    };

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

    const name = (node: HTMLElement, item: Day) => {
        const comp = new TextComponent(node)
            .setValue(item.name)
            .setPlaceholder("Name")
            .onChange((v) => {
                item.name = v;
                dispatch("weekday-update", weekdays);
                weekdays = weekdays;
            });
        comp.inputEl.setAttr("style", "width: 100%;");
    };

    function startDrag(e: Event) {
        // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
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

    const dispatch = createEventDispatcher();

    export let weekdays: Day[] = [];
    $: {
        dispatch("weekday-update", weekdays);
        //TODO: add new days to dropdown, remove removed days from dropdown
    }

    $: {
        dispatch("first-weekday-update", firstWeekday);
    }
</script>

<div class="fantasy-calendar-container">
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
                <div
                    animate:flip={{ duration: flipDurationMs }}
                    class="weekday"
                >
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
    <div class="add-new" use:add />
    {#if weekdays.length}
        <div class="first-weekday">
            <div class="setting-item">
                <div class="setting-item-info">
                    <div class="setting-item-name">First Day</div>
                    <div class="setting-item-description">
                        This only effects which day of the week the first year
                        starts on.
                    </div>
                </div>
                <div class="setting-item-control">
                    <select class="dropdown" bind:value={firstWeekday}>
                        {#each weekdays as weekday, index}
                            <option
                                value={index}
                                selected={index == firstWeekday}
                                >{weekday.name ?? ""}</option
                            >
                        {/each}
                    </select>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
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
    .add-new {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        display: flex;
        justify-content: flex-end;
    }
</style>
