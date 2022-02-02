<script lang="ts">
    import { Setting } from "obsidian";
    import { warning } from "./utils";

    export let open = true;
    export let name: string;
    export let warn: boolean = false;
    export let label: string = null;
    const details = (node: HTMLElement) => {
        if (open) node.setAttr("open", "open");
    };
    const summary = (node: HTMLDivElement) => {
        new Setting(node).setHeading().setName(name);
    };
</script>

<details class="fantasy-calendar-nested-settings" use:details>
    <summary class="fantasy-calendar-nested-summary">
        <div class="setting-item setting-item-heading">
            <div class="setting-item-info">
                <div class="setting-item-name">{name}</div>
                <div class="setting-item-description" />
            </div>
        </div>
        <div class="collapser">
            <div class="warning-container">
                {#if warn}
                    <div use:warning />
                {/if}
                <div class="handle" />
            </div>
        </div>
    </summary>
    {#if warn && label}
        <div class="warning-label-container">
            <div class="setting-item-description warning-label">
                {label}
            </div>
        </div>
    {/if}
    <slot />
</details>

<style>
    .warning-label-container {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        right: 0;
    }
    .fantasy-calendar-nested-summary {
        position: relative;
    }
    .warning-label {
        color: var(--text-error);
    }
    .fantasy-calendar-nested-summary {
        outline: none;
        display: block !important;
        list-style: none !important;
        list-style-type: none !important;
        min-height: 1rem;
        border-top-left-radius: 0.1rem;
        border-top-right-radius: 0.1rem;
        cursor: pointer;
    }

    summary::-webkit-details-marker,
    summary::marker {
        display: none !important;
    }
    .collapser {
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
        content: "";
    }

    .handle {
        transform: rotate(0deg);
        transition: transform 0.25s;
        background-color: currentColor;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-image: var(--admonition-details-icon);
        mask-image: var(--admonition-details-icon);
        width: 20px;
        height: 20px;
    }

    details[open] .handle {
        transform: rotate(90deg);
    }
</style>
