<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Event, EventCategory } from "src/@types";
    import { ExtraButtonComponent } from "obsidian";
    import Dot from "./Dot.svelte";

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
    export let event: Event;
    export let category: EventCategory;
    export let date: string;
</script>

<div class="event">
    <div class="event-info">
        <span class="setting-item-name">
            {#if category != null}
                <Dot color={category.color} label={category.name} />
            {/if}
            {event.name}
        </span>
        <div class="setting-item-description">
            <div class="date">
                {date}
            </div>
            <span class="clamp">{event.description ?? ""}</span>
        </div>
    </div>

    <div class="icons">
        <div class="icon" use:edit on:click={() => dispatch("edit")} />
        <div class="icon" use:trash on:click={() => dispatch("delete")} />
    </div>
</div>

<style>
    .event {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    .event-info {
        width: 100%;
    }

    .icons {
        display: flex;
        align-self: flex-start;
        justify-self: flex-end;
        align-items: center;
    }
    .event .icon {
        align-items: center;
    }
    .date {
        display: flex;
        justify-content: flex-start;
        gap: 0.25rem;
    }
    .clamp {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        word-break: keep-all;
        overflow: hidden;
        width: calc(var(--event-max-width) * 0.75);
    }
</style>
