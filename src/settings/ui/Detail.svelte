<script lang="ts">
    import { ButtonComponent } from "obsidian";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let label: string;
    export let open: boolean = false;

    const add = (node: HTMLElement) => {
        const b = new ButtonComponent(node)
            .setTooltip("Add New")
            .setButtonText("+")
            .onClick(async () => {
                dispatch("new-item");
            });
        b.buttonEl.style.width = "100%";
    };
</script>

<details {open}>
    <summary>
        <h4>
            {label}
        </h4>
    </summary>
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
