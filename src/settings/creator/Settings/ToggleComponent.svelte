<script lang="ts">
    export let name: string;
    export let desc: string | DocumentFragment;
    export let value: boolean;
    const descEl = (node: HTMLElement) => {
        node.append(desc);
    };
</script>

<div class="setting-item mod-toggle">
    <div class="setting-item-info">
        <div class="setting-item-name">{name}</div>
        {#if desc}
            {#if typeof desc == "string"}
                <div class="setting-item-description">{desc}</div>
            {:else}
                <div class="setting-item-description" use:descEl />
            {/if}
        {/if}
    </div>
    <div class="setting-item-control">
        <div class="checkbox-container" class:is-enabled={value} on:click />
    </div>
</div>
