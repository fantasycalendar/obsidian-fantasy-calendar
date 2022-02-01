<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import {
        App,
        ButtonComponent,
        ExtraButtonComponent,
        setIcon,
        Setting,
        TextComponent
    } from "obsidian";
    import type { Calendar, Year } from "src/@types";

    import { nanoid } from "src/utils/functions";
    import { confirmWithModal } from "../../modals/confirm";
    import ToggleComponent from "../Settings/ToggleComponent.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import type { Writable } from "svelte/store";
    import Details from "../Utilities/Details.svelte";

    export let calendar: Calendar;

    const store = getContext<Writable<Calendar>>("store");
    store.subscribe((v) => (calendar = v));

    $: years = calendar.static.years;
    $: useCustomYears = calendar.static.useCustomYears;

    const grip = (node: HTMLElement) => {
        setIcon(node, "fantasy-calendar-grip");
    };

    const trash = (node: HTMLElement, item: Year) => {
        new ExtraButtonComponent(node)
            .setIcon("trash")
            .onClick(
                () => (years = years.filter((year) => year.id !== item.id))
            );
    };

    const name = (node: HTMLElement, item: Year) => {
        const comp = new TextComponent(node)
            .setValue(item.name)
            .setPlaceholder("Name")
            .onChange((v) => {
                item.name = v;
                dispatch("years-update", years);
                years = years;
            });
        comp.inputEl.setAttr("style", "width: 100%;");
    };

    export let app: App;

    const customDesc = createFragment((el) => {
        el.createSpan({
            text: "Create custom years to display instead of incrementing from 1."
        });
        el.createEl("br");
        el.createSpan({ text: "If on, " });
        el.createEl("strong", {
            text: "only the years added below will be displayed."
        });
        return el;
    });

    const confirmCustom = async () => {
        if (
            calendar.static.useCustomYears &&
            years?.length &&
            (await confirmWithModal(
                app,
                "The custom years you have created will be removed. Proceed?"
            ))
        ) {
            calendar.static.years = [];
        }
        calendar.static.useCustomYears = !calendar.static.useCustomYears;
        store.set(calendar);
    };

    function startDrag(e: Event) {
        e.preventDefault();
        dragDisabled = false;
    }
    const flipDurationMs = 300;
    let dragDisabled = false;

    function handleConsider(e: CustomEvent<GenericDndEvent<Year>>) {
        const {
            items: newItems,
            info: { source, trigger }
        } = e.detail;
        years = newItems;
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            dragDisabled = true;
        }
    }
    function handleFinalize(e: CustomEvent<GenericDndEvent<Year>>) {
        const {
            items: newItems,
            info: { source }
        } = e.detail;
        years = newItems;
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }

    const dispatch = createEventDispatcher();

    $: {
        dispatch("years-update", years);
        //TODO: add new days to dropdown, remove removed days from dropdown
    }

    $: {
        dispatch("use-custom-update", useCustomYears);
    }
</script>

<Details
    name={"Years"}
    warn={useCustomYears && !years?.length}
    label={"At least one year is required when using custom years"}
>
    <ToggleComponent
        name="Use Custom Years"
        desc={customDesc}
        value={useCustomYears}
        on:click={() => confirmCustom()}
    />

    {#if useCustomYears}
        <AddNew
            on:click={() => {
                calendar.static.years = [
                    ...(years ?? []),
                    {
                        name: null,
                        id: nanoid(6),
                        type: "year"
                    }
                ];
                store.set(calendar);
            }}
        />

        {#if !years || !years.length}
            <NoExistingItems message={"Create a new year to see it here."} />
        {:else}
            <div
                use:dndzone={{ items: years, flipDurationMs, dragDisabled }}
                class="existing-items"
                on:consider={handleConsider}
                on:finalize={handleFinalize}
            >
                {#each years as item (item.id)}
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
    {/if}
</Details>

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
</style>
