<script lang="ts">
    import { ButtonComponent } from "obsidian";

    export let disabled = false;
    $: {
        if (button) {
            button.setDisabled(disabled);
        }
    }
    export let label: string = "Add New";

    let button: ButtonComponent;
    const add = (node: HTMLElement) => {
        button = new ButtonComponent(node)
            .setButtonText("+")
            .setDisabled(disabled);
    };
</script>

<div
    class:disabled
    class="add-new setting-item"
    use:add
    on:click
    aria-label={label}
/>

<style>
    .add-new,
    .add-new :global(button) {
        width: 100%;
    }
    .disabled :global(button) {
        cursor: not-allowed;
    }
</style>
