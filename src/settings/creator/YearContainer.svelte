<script lang="ts">
    import { createEventDispatcher } from "svelte";
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
    import { confirmWithModal } from "../modals/confirm";

    export let calendar: Calendar;

    $: years = calendar.static.years;
    $: useCustomYears = calendar.static.useCustomYears;
    
    const add = (node: HTMLElement) => {
        new ButtonComponent(node)
            .setTooltip("Add New")
            .setButtonText("+")
            .onClick(async () => {
                calendar.static.years = [
                    ...years,
                    {
                        name: null,
                        id: nanoid(6),
                        type: "year"
                    }
                ];
            }).buttonEl.style.width = "100%";
    };
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

    const customNode = (node: HTMLElement) => {
        new Setting(node)
            .setName("Use Custom Years")
            .setDesc(
                createFragment((el) => {
                    el.createSpan({
                        text: "Create custom years to display instead of incrementing from 1."
                    });
                    el.createEl("br");
                    el.createSpan({ text: "If on, " });
                    el.createEl("strong", {
                        text: "only the years added below will be displayed."
                    });
                    return el;
                })
            )
            .addToggle((t) => {
                let skip = false;
                t.setValue(useCustomYears).onChange(async (v) => {
                    if (!skip && useCustomYears && years?.length) {
                        if (
                            await confirmWithModal(
                                app,
                                "The custom years you have created will be removed. Proceed?"
                            )
                        ) {
                            years = [];
                            useCustomYears = v;
                            skip = false;
                        }
                        skip = true;
                        t.setValue(useCustomYears);
                    } else {
                        skip = false;
                        useCustomYears = v;
                    }
                });
            });
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

<div class="use-custom" use:customNode />
<div>
    <div class="add-new" use:add />
</div>
{#if !years || !years.length}
    <div class="existing-items">
        <span>Create a new year to see it here.</span>
    </div>
{:else}
    <div
        use:dndzone={{ items: years, flipDurationMs, dragDisabled }}
        class="existing-items"
        on:consider={handleConsider}
        on:finalize={handleFinalize}
    >
        {#each years as item (item.id)}
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
    .use-custom {
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
