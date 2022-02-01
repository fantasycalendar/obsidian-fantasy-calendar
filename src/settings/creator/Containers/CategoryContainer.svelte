<script lang="ts">
    import {
        ExtraButtonComponent,
        TextComponent
    } from "obsidian";
    import { createEventDispatcher } from "svelte";
    import randomColor from "randomcolor";

    import type { Calendar, EventCategory } from "src/@types";
    import { nanoid } from "src/utils/functions";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";

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
</script>

<AddNew
    on:click={() =>
        (calendar.categories = [
            ...categories,
            {
                id: nanoid(6),
                color: randomColor(),
                name: "Category"
            }
        ])}
/>

{#if !categories.length}
    <NoExistingItems message={"Create a new event category to see it here."} />
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
