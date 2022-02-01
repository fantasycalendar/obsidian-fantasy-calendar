<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import { ExtraButtonComponent, setIcon, TextComponent } from "obsidian";
    import type { Calendar, Day } from "src/@types";

    import { nanoid } from "src/utils/functions";

    import ToggleComponent from "../Settings/ToggleComponent.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
import Details from "../Utilities/Details.svelte";

    const dispatch = createEventDispatcher();
    export let calendar: Calendar;

    $: weekdays = calendar.static.weekdays;
    let firstWeekday = calendar.static.firstWeekDay;
    $: {
        firstWeekday = calendar.static.firstWeekDay;
    }
    $: overflow = calendar.static.overflow;

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
</script>

<Details name={"Weekdays"} warn={!weekdays?.length} label={"At least one weekday is required"}>
    <ToggleComponent
        name={"Overflow Weeks"}
        desc={"Turn this off to make each month start on the first of the week."}
        value={calendar.static.overflow}
        on:click={() => (calendar.static.overflow = !calendar.static.overflow)}
    />

    <div class="setting-item">
        <div class="setting-item-info">
            <div class="setting-item-name">First Day</div>
            <div class="setting-item-description">
                The day of the week the first year starts on.
            </div>
        </div>
        <div class="setting-item-control">
            <select
                class="dropdown"
                aria-label={weekdays.filter((v) => v.name?.length).length
                    ? null
                    : "Named Weekday Required"}
                bind:value={calendar.static.firstWeekDay}
            >
                <option selected hidden disabled>Select a Weekday</option>
                {#each weekdays.filter((v) => v.name?.length) as weekday, index}
                    <option disabled={!overflow} value={index}>
                        {weekday.name ?? ""}
                    </option>
                {/each}
            </select>
        </div>
    </div>

    <AddNew
        on:click={() =>
            (calendar.static.weekdays = [
                ...weekdays,
                {
                    type: "day",
                    name: null,
                    id: nanoid(6)
                }
            ])}
    />

    {#if !weekdays.length}
        <NoExistingItems message={"Create a new weekday to see it here."} />
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
</Details>

<style>
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
