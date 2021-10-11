<script lang="ts">
    import { ExtraButtonComponent } from "obsidian";
    import type CalendarHelper from "src/helper";

    import { createEventDispatcher } from "svelte";

    export let calendar: CalendarHelper;
    let currentDate = calendar.displayedDate;

    calendar.on("day-update", () => {
        currentDate = calendar.displayedDate;
    });

    const dispatch = createEventDispatcher();

    const close = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("cross").setTooltip("Close");
    };
    const left = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("left-arrow");
    };
    const right = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("right-arrow");
    };
</script>

<div class="day-view">
    <div class="back">
        <div use:close on:click={() => dispatch("close")} />
    </div>
    <div class="nav">
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
</div>

<style>
    .back {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .nav {
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
</style>
