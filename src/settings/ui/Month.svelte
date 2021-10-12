<script lang="ts">
    import { ExtraButtonComponent } from "obsidian";
    import type { Month } from "src/@types";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let month: Month;

    let name = month.name;
    let type = month.type;
    let length = month.length;

    const trash = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("trash").onClick(() => {
            dispatch("month-delete");
        });
    };

    $: {
        month.name = name;
    }
    $: {
        month.type = type;
        if (type == "intercalary") {
            length = 1;
        }
    }
    $: {
        month.length = length;
    }
</script>

<div class="month">
    <input
        type="text"
        spellcheck="false"
        value={name}
        placeholder="Name"
        style="width: 100%;"
    />
    <input
        type="number"
        spellcheck="false"
        placeholder="Length"
        value={length}
        disabled={month.type == "intercalary"}
        style="width: 100%;"
        min="0"
    />
    <select class="dropdown" bind:value={type}>
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
    }

    .month .icon {
        align-items: center;
    }
</style>
