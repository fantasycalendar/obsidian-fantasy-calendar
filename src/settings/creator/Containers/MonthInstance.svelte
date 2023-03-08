<script lang="ts">
    import { debounce, ExtraButtonComponent } from "obsidian";
    import type { Month } from "src/@types";
    import { createEventDispatcher, getContext } from "svelte";

    const dispatch = createEventDispatcher();

    export let month: Month;
    const store = getContext("store");
    const { monthStore } = store;

    let name = month.name;
    let type = month.type;
    let length = month.length;

    const trash = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon("trash")
            .onClick(() => monthStore.delete(month.id));
    };

    const update = debounce(
        () => {
            month.name = name;
            month.type = type;
            month.length = length;
            monthStore.update(month.id, month);
        },
        300,
        true
    );
</script>

<div class="month">
    <input
        type="text"
        spellcheck="false"
        bind:value={name}
        on:input={update}
        placeholder="Name"
        style="width: 100%;"
    />
    <input
        type="number"
        spellcheck="false"
        placeholder="Length"
        bind:value={length}
        on:input={update}
        style="width: 100%;"
        min="0"
    />
    <select class="dropdown" bind:value={type} on:input={update}>
        <option value="month">Month</option>
        <option value="intercalary">Intercalary</option>
    </select>

    <div class="icon" use:trash />
</div>

<style>
    .month {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
    }

    .month .icon {
        align-items: center;
    }
</style>
