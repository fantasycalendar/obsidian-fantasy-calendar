<script lang="ts">
    import { Setting } from "obsidian";
    import { warning } from "./utils";

    export let open = true;
    export let name: string;
    export let warn: boolean = false;
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
                <div class="name-container">
                    {#if warn}
                        <div use:warning />
                    {/if}
                    <div class="setting-item-name">{name}</div>
                </div>
                <div class="setting-item-description" />
            </div>
        </div>
        <div class="collapser">
            <div class="handle" />
        </div>
    </summary>
    <slot />
</details>

<style>
    .name-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
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
