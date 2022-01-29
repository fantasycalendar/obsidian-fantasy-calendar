<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { LeapDay } from "src/@types";
    import { ExtraButtonComponent } from "obsidian";
    import { getIntervalDescription } from "src/utils/functions";

    const dispatch = createEventDispatcher();

    const trash = (node: HTMLElement) => {
        let b = new ExtraButtonComponent(node)
            .setIcon("trash")
            .setTooltip("Delete");
        b.extraSettingsEl.setAttr("style", "margin-left: 0;");
    };
    const edit = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("pencil").setTooltip("Edit");
    };
    export let leapday: LeapDay;

    $: description = getIntervalDescription(leapday);
</script>

<div class="leapday">
    <div class="leapday-info">
        <span class="setting-item-name">
            {leapday.name}
        </span>
        <div class="setting-item-description">{description}</div>
    </div>

    <div class="icons">
        <div class="icon" use:edit on:click={() => dispatch("edit")} />
        <div class="icon" use:trash on:click={() => dispatch("delete")} />
    </div>
</div>

<style>
    .leapday {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    .leapday-info {
        width: 100%;
    }

    .icons {
        display: flex;
        align-self: center;
        justify-self: flex-end;
        align-items: center;
    }
    .leapday .icon {
        align-items: center;
    }
</style>
