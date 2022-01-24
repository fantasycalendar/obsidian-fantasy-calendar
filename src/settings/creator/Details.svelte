<script lang="ts">
    import { Setting } from "obsidian";

    export let open = false;
    export let name: string;
    const details = (node: HTMLDetailsElement) => {
        if (open) node.setAttr("open", "open");
    };
    const summary = (node: HTMLDivElement) => {
        new Setting(node).setHeading().setName(name);
    };
</script>

<details class="fantasy-calendar-nested-settings" use:details>
    <summary>
        <div use:summary />
        <div class="collapser">
            <div class="handle" />
        </div>
    </summary>
    <slot />
</details>

<style>
    summary {
        outline: none;
        display: block !important;
        list-style: none !important;
        list-style-type: none !important;
        min-height: 1rem;
        border-top-left-radius: 0.1rem;
        border-top-right-radius: 0.1rem;
        cursor: pointer;
        position: relative;
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
