<script lang="ts">
    import { ExtraButtonComponent, TextComponent } from "obsidian";
    import { createEventDispatcher } from "svelte";

    import type { EventCategory } from "src/@types";
    import Detail from "./Detail.svelte";
    import { nanoid } from "src/utils/functions";
    import { DEFAULT_CATEGORY_COLOR } from "src/utils/constants";

    const dispatch = createEventDispatcher();

    export let categories: EventCategory[] = [];

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

    const addNew = () => {
        const cat = {
            id: nanoid(6),
            color: DEFAULT_CATEGORY_COLOR,
            name: "Category"
        };
        categories = categories;
        dispatch("new", cat);
    };
</script>

<Detail label="Event Categories" on:new-item={addNew}>
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
</Detail>

<style>
    .category {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        gap: 0.5rem;
        padding-top: 0.75rem;
    }
</style>
