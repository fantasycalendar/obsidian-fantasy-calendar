<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
    import { createEventDispatcher } from "svelte";
    import { ExtraButtonComponent, setIcon } from "obsidian";

    export let items: any[];

    function startDrag(e: Event) {
        e.preventDefault();
        dragDisabled = false;
    }
    const flipDurationMs = 300;
    let dragDisabled = false;

    const dispatch = createEventDispatcher();
    function handleConsider(e: CustomEvent<GenericDndEvent<any>>) {
        const {
            items: newItems,
            info: { source, trigger }
        } = e.detail;
        dispatch("sort", newItems);
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            dragDisabled = true;
        }
    }
    function handleFinalize(e: CustomEvent<GenericDndEvent<any>>) {
        const {
            items: newItems,
            info: { source }
        } = e.detail;
        dispatch("sort", newItems);
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }
    const grip = (node: HTMLElement) => {
        setIcon(node, "fantasy-calendar-grip");
    };

    const trash = (node: HTMLElement, item: any) => {
        new ExtraButtonComponent(node)
            .setIcon("trash")
            .onClick(() => dispatch("delete", item));
    };
</script>

<div
    use:dndzone={{ items, flipDurationMs, dragDisabled }}
    class="existing-items"
    on:consider={handleConsider}
    on:finalize={handleFinalize}
>
    {#each items as item (item.id)}
        <div animate:flip={{ duration: flipDurationMs }} class="weekday">
            <div
                class="icon"
                use:grip
                on:mousedown={startDrag}
                on:touchstart={startDrag}
            />

            <slot />

            <div class="icon" use:trash={item} />
        </div>
    {/each}
</div>
