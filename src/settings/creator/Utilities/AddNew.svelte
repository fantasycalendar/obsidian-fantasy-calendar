<script lang="ts">
import { ButtonComponent } from "obsidian";


    const add = (node: HTMLElement) => {
        new ButtonComponent(node).setTooltip("Add New").setButtonText("+");
    };
</script>

<div class="add-new setting-item" use:add on:click />

<style>
    .add-new,
    .add-new :global(button) {
        width: 100%;
    }
</style>
