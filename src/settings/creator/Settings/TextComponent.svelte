<script lang="ts">
    import { warning } from "../Utilities/utils";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string | number;
    export let name: string;
    export let warn: boolean = false;
    export let type = "text";

    export let desc: string | DocumentFragment;

    export let placeholder = name;
    const descEl = (node: HTMLElement) => {
        node.append((desc as DocumentFragment).cloneNode(true));
    };
</script>

<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">
            {name}
        </div>
        {#if desc}
            {#if typeof desc == "string"}
                <div class="setting-item-description">{desc}</div>
            {:else}
                <div class="setting-item-description" use:descEl />
            {/if}
        {/if}
    </div>
    <div class="setting-item-control">
        <div class="warning-container">
            <slot>
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
            </slot>
        </div>
    </div>
</div>

<style>
    input.warn {
        border-color: var(--text-error);
    }
</style>
