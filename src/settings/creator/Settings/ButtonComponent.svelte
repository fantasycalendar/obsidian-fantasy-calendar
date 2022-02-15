<script lang="ts">
    import { setIcon } from "obsidian";

    export let name: string;
    export let desc: string = "";
    export let label: string = null;
    export let icon: string = null;
    export let text: string = null;

    const build = (node: HTMLElement) => {
        setIcon(node, icon);
    };
</script>

<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">{name}</div>
        <div class="setting-item-description">{desc}</div>
    </div>
    <div class="setting-item-control">
        <button aria-label={label} on:click>
            {#if icon}
                <div use:build />
            {:else if text}
                {text}
            {/if}
        </button>
    </div>
</div>
