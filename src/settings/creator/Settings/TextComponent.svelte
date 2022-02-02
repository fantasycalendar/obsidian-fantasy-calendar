<script lang="ts">
    import { warning } from "../Utilities/utils";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string;
    export let name: string;
    export let warn: boolean = false;
    export let type = "text";

    export let desc = "";

    export let placeholder = name;
</script>

<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">
            {name}
        </div>
        <div class="setting-item-description">{desc}</div>
    </div>
    <div class="setting-item-control">
        <div class="warning-container">
            {#if warn}
                <div use:warning />
            {/if}
            {#if type == "text"}
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
            {:else if type == "number"}
                <input
                    type="number"
                    spellcheck="false"
                    {placeholder}
                    class:warn
                    bind:value
                    on:blur={() => {
                        dispatch("blur", value);
                    }}
                />
            {/if}
        </div>
    </div>
</div>

<style>
    input.warn {
        border-color: var(--text-error);
    }
</style>
