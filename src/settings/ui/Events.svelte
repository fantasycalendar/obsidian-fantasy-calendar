<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { ButtonComponent, ExtraButtonComponent } from "obsidian";

    import type { Event } from "src/@types";

    export let events: Event[] = [];

    const dispatch = createEventDispatcher();

    const add = (node: HTMLElement) => {
        new ButtonComponent(node)
            .setTooltip("Add Event")
            .setButtonText("+")
            .onClick(async () => {
                dispatch("new-event");
            });
    };
    const trash = (node: HTMLElement, item: Event) => {
        let b = new ExtraButtonComponent(node)
            .setIcon("trash")
            .setTooltip("Delete")
            .onClick(
                () => (events = events.filter((event) => event.id !== item.id))
            );
        b.extraSettingsEl.setAttr("style", "margin-left: 0;");
    };
    const edit = (node: HTMLElement, item: Event) => {
        new ExtraButtonComponent(node)
            .setIcon("pencil")
            .setTooltip("Edit")
            .onClick(() => {
                dispatch("new-event", item);
            });
    };
</script>

<div class="fantasy-calendar-container">
    {#if !events.length}
        <div class="existing-items">
            <span>Create a new event to see it here.</span>
        </div>
    {:else}
        <div class="existing-items">
            {#each events as event}
                <div class="event">
                    <div class="event-info">
                        <span class="setting-item-name">{event.name}</span>
                        <div class="setting-item-description">
                            <div class="date">
                                {#if event.date.day}
                                    <span>{event.date.day}</span>
                                {/if}
                                {#if event.date.month}
                                    <span
                                        >{event.date.month}{event.date.year
                                            ? ","
                                            : ""}</span
                                    >
                                {/if}
                                {#if event.date.year}
                                    <span>{event.date.year}</span>
                                {/if}
                            </div>
                            <span class="clamp">{event.description}</span>
                        </div>
                    </div>

                    <div class="icons">
                        <div class="icon" use:edit={event} />
                        <div class="icon" use:trash={event} />
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    <div class="add-new" use:add />
</div>

<style>
    .event {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    .event-info {
        width: 100%;
    }

    .event .icon {
        align-items: center;
    }

    .icons {
        display: flex;
        justify-self: flex-end;
        align-items: center;
    }

    .event {
        margin-top: 0.5rem;
    }
    .add-new {
        padding-top: 0.75rem;
        padding-bottom: 0;
        display: flex;
        justify-content: flex-end;
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
