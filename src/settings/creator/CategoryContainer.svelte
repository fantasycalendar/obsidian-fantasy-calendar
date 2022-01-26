<script lang="ts">
    import {
        ButtonComponent,
        ExtraButtonComponent,
        TextComponent
    } from "obsidian";
    import { createEventDispatcher } from "svelte";

    import type { Calendar, EventCategory } from "src/@types";
    import { nanoid } from "src/utils/functions";
    import { DEFAULT_CATEGORY_COLOR } from "src/utils/constants";

    const dispatch = createEventDispatcher();

    export let calendar: Calendar;

    $: categories = calendar.categories;

    const name = (node: HTMLElement, category: EventCategory) => {
        const comp = new TextComponent(node)
            .setValue(category.name)
            .setPlaceholder("Name")
            .onChange((v) => {
                category.name = v;
                dispatch("update", category);
            });
        comp.inputEl.setAttr("style", "width: 100%;");
    };
    const trash = (node: HTMLElement, item: EventCategory) => {
        new ExtraButtonComponent(node).setIcon("trash").onClick(() => {
            categories = categories.filter(
                (category) => category.id !== item.id
            );

            dispatch("delete", item);
        });
    };
    const updateColor = (event: Event, category: EventCategory) => {
        const { target } = event;
        if (!(target instanceof HTMLInputElement)) return;
        category.color = target.value;
        dispatch("update", category);
    };

    const add = (node: HTMLElement) => {
        new ButtonComponent(node)
            .setTooltip("Add New")
            .setButtonText("+")
            .onClick(async () => {
                calendar.categories = [
                    ...categories,
                    {
                        id: nanoid(6),
                        color: DEFAULT_CATEGORY_COLOR,
                        name: "Category"
                    }
                ];
            }).buttonEl.style.width = "100%";
    };
</script>

<div>
    <div class="add-new" use:add />
</div>
{#if !categories.length}
    <div class="existing-items">
        <span>Create a new category to see it here.</span>
    </div>
{:else}
    <div class="existing-items">
        {#each categories as category}
            <div class="category">
                <div use:name={category} />
                <div class="color">
                    <input
                        type="color"
                        value={category.color}
                        on:change={(evt) => updateColor(evt, category)}
                    />
                </div>
                <div use:trash={category} />
            </div>
        {/each}
    </div>
{/if}

<style>
    .category {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        gap: 0.5rem;
        padding-top: 0.75rem;
    }
</style>
