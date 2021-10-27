<script lang="ts">
    import { ButtonComponent } from "obsidian";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let label: string;
    export let open: boolean = false;
    export let disabled: boolean = false;

    let button: ButtonComponent;
    const add = (node: HTMLElement) => {
        button = new ButtonComponent(node)
            .setTooltip("Add New")
            .setButtonText("+")
            .setDisabled(disabled)
            .onClick(async () => {
                dispatch("new-item");
            });
        button.buttonEl.style.width = "100%";
    };

    $: {
        if (button) {
            button.setDisabled(disabled);
        }
    }
</script>

<details {open}>
    <summary>
        <h4>
            {label}
        </h4>
    </summary>
    <slot name="pre-add" />
    <div class="add-new" use:add />
    <div class="fantasy-calendar-container">
        <slot />
    </div>
</details>

<style>
    .add-new {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;

        display: flex;
        width: 100%;
    }
</style>
