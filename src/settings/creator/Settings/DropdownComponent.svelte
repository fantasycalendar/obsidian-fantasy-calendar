<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let name: string;
    export let desc = "";
    export let label: string;

    export let options: Array<[string, string | number]>;
    export let selected: string | number = null;
</script>

<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">{name}</div>
        <div class="setting-item-description">
            {desc}
        </div>
    </div>
    <div class="setting-item-control">
        <select class="dropdown" aria-label={label} on:change>
            <slot />
            {#each options as [option, index]}
                <option value={index} selected={index == selected}
                    >{option ?? ""}</option
                >
            {/each}
        </select>
    </div>
</div>
