<script lang="ts">
    import { ExtraButtonComponent } from "obsidian";
    import type CalendarHelper from "src/helper";

    import { createEventDispatcher } from "svelte";
    import Flags from "./Flags.svelte";

    export let calendar: CalendarHelper;

    let currentDate = calendar.viewedDate;
    let events = calendar.getEventsOnDate(calendar.viewing);
    let categories = calendar.object.categories;

    calendar.on("day-update", () => {
        currentDate = calendar.viewedDate;
        events = calendar.getEventsOnDate(calendar.viewing);
    });

    const dispatch = createEventDispatcher();

    const close = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("cross").setTooltip("Close");
    };
    const reveal = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon("fantasy-calendar-reveal")
            .setTooltip("Show on Calendar")
            .onClick(() => {
                calendar.displayed.year = calendar.viewing.year;
                calendar.setCurrentMonth(calendar.viewing.month);
            });
    };
    const left = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("left-arrow");
    };
    const right = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("right-arrow");
    };
</script>

<div class="day-view">
    <div class="nav">
        <div use:reveal on:click={() => dispatch("reveal")} />
        <div use:close on:click={() => dispatch("close")} />
    </div>
    <div class="date">
        <div
            class="arrow calendar-clickable"
            use:left
            aria-label="Previous"
            on:click={() => calendar.goToPreviousDay()}
        />
        <div class="displayed">
            <h3 class="fantasy-title title">
                <span class="current">{currentDate}</span>
            </h3>
        </div>
        <div
            class="arrow right calendar-clickable"
            use:right
            aria-label="Next"
            on:click={(evt) => calendar.goToNextDay()}
        />
    </div>
    <Flags {events} {categories} dayView={true} />
</div>

<style>
    .day-view {
        padding: 5px 15px;
        display: flex;
        flex-flow: column nowrap;
        gap: 0.5rem;
    }

    .nav,
    .date {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .calendar-clickable {
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
    h3 {
        margin: 0;
    }

    .day-view :global(.flag-container > .flag) {
        padding-left: 0.5rem;
    }
</style>
