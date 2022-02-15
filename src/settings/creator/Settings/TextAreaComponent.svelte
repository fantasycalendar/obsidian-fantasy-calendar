<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string;
    export let name: string;

    export let placeholder = name;
    export let cls = "";
</script>

<div class="text-area-component setting-item" class:cls>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>{name}</label>
    <textarea
        spellcheck="false"
        {placeholder}
        bind:value
        on:blur={() => dispatch("blur", value)}
    />
</div>

<style>
    .text-area-component {
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        width: 100%;
    }
    textarea {
        width: 100%;
    }
</style>
