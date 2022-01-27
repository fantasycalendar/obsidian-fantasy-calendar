<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string;
    export let name: string;

    export let desc = "";

    export let placeholder = name;
</script>

<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">{name}</div>
        <div class="setting-item-description">{desc}</div>
    </div>
    <div class="setting-item-control">
        <input
            type="text"
            spellcheck="false"
            {placeholder}
            bind:value
            on:blur={() => {
                dispatch("blur", value);
            }}
        />
    </div>
</div>
