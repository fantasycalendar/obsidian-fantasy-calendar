<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import { ExtraButtonComponent, setIcon } from "obsidian";
    import type { Calendar, Era } from "src/@types";

    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import type { Writable } from "svelte/store";
    import Details from "../Utilities/Details.svelte";
    import { CreateEraModal } from "src/settings/modals/era/era";
    import FantasyCalendar from "src/main";
    import { nanoid } from "src/utils/functions";

    export let calendar: Calendar;
    export let plugin: FantasyCalendar;

    const store = getContext<Writable<Calendar>>("store");
    store.subscribe((v) => (calendar = v));

    $: eras = calendar.static.eras;
    /* Fix old era schema */
    if (eras && eras.length && eras.some((era) => !era.id)) {
        eras = eras.map((era) => {
            return {
                ...era,
                id: era.id ?? nanoid(6),
                restart: era.restart ?? false,
                endsYear: era.endsYear ?? false,
                event: era.event ?? false
            };
        });
        plugin.saveSettings();
    }

    const grip = (node: HTMLElement) => {
        setIcon(node, "fantasy-calendar-grip");
    };

    const trash = (node: HTMLElement, item: Era) => {
        new ExtraButtonComponent(node)
            .setIcon("trash")
            .onClick(() => (eras = eras.filter((era) => era.id !== item.id)));
    };

    function startDrag(e: Event) {
        e.preventDefault();
        dragDisabled = false;
    }
    const flipDurationMs = 300;
    let dragDisabled = false;

    function handleConsider(e: CustomEvent<GenericDndEvent<Era>>) {
        const {
            items: newItems,
            info: { source, trigger }
        } = e.detail;
        eras = newItems;
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            dragDisabled = true;
        }
    }
    function handleFinalize(e: CustomEvent<GenericDndEvent<Era>>) {
        const {
            items: newItems,
            info: { source, id }
        } = e.detail;
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
        eras = newItems;
    }

    const dispatch = createEventDispatcher();

    const add = (era?: Era) => {
        const modal = new CreateEraModal(plugin, calendar, era);
        modal.onClose = () => {
            if (!modal.saved) return;
            if (modal.editing) {
                const index = calendar.events.findIndex(
                    (e) => e.id === modal.era.id
                );

                calendar.static.eras.splice(index, 1, { ...modal.era });
            } else {
                calendar.static.eras.push({ ...modal.era });
            }
            eras = calendar.static.eras;
        };
        modal.open();
    };
    $: {
        dispatch("eras-update", eras);
        //TODO: add new days to dropdown, remove removed days from dropdown
    }
</script>

<Details name={"Eras"}>
    <AddNew on:click={() => add()} />

    {#if !eras || !eras.length}
        <NoExistingItems message={"Create a new era to see it here."} />
    {:else}
        <div
            use:dndzone={{ items: eras, flipDurationMs, dragDisabled }}
            class="existing-items"
            on:consider={handleConsider}
            on:finalize={handleFinalize}
        >
            {#each eras as item (item.id)}
                <div animate:flip={{ duration: flipDurationMs }} class="era">
                    <div
                        class="icon"
                        use:grip
                        on:mousedown={startDrag}
                        on:touchstart={startDrag}
                    />
                    <div>{item.name}</div>
                    <div>{item.start}</div>
                    <div class="icon" use:trash={item} />
                </div>
            {/each}
        </div>
    {/if}
</Details>

<style>
    .era {
        display: grid;
        grid-template-columns: auto 1fr 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .era .icon {
        align-items: center;
    }
    .era {
        margin-top: 0.5rem;
    }
</style>
