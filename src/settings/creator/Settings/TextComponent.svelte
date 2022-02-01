<script lang="ts">
    import { warning } from "../Utilities/utils";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string;
    export let name: string;
    export let warn: boolean = false;

    export let desc = "";

    export let placeholder = name;
</script>

<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">
            <div class="name-container">
                {#if warn}
                    <div use:warning />
                {/if}
                {name}
            </div>
        </div>
        <div class="setting-item-description">{desc}</div>
    </div>
    <div class="setting-item-control">
        <input
            type="text"
            spellcheck="false"
            {placeholder}
            class:warn
            bind:value
            on:blur={() => {
                dispatch("blur", value);
            }}
        />
    </div>
</div>

<style>
    .name-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    input.warn {
        border-color: var(--text-error);
    }
</style>
