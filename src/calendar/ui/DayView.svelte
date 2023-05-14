<script lang="ts">
    import { ExtraButtonComponent } from "obsidian";
    import { createEventDispatcher } from "svelte";
    import Flags from "./Flags.svelte";
    import MoonUI from "./Moon.svelte";
    import { getTypedContext } from "../view";
    import type { Phase, Moon } from "src/@types";
    import { dateString } from "src/utils/functions";
    import { REVEAL_ICON } from "src/utils/constants";

    const global = getTypedContext("store");
    const ephemeral = getTypedContext("ephemeralStore");
    $: store = $global;
    $: viewing = ephemeral.viewing;
    $: date = dateString($viewing, $store);
    $: yearCalculator = store.yearCalculator;
    $: displayedMonth = yearCalculator
        .getYearFromCache($viewing.year)
        .getMonthFromCache($viewing.month);
    $: daysBeforeMonth = displayedMonth.daysBefore;
    $: daysBeforeDay = $daysBeforeMonth + $viewing.day;
    $: events = store.eventCache.getItemsOrRecalculate($viewing);
    $: moons = store.moonCache.getItemsOrRecalculate($viewing);
    $: displayDayNumber = ephemeral.displayDayNumber;
    $: displayMoons = ephemeral.displayMoons;

    const dispatch = createEventDispatcher();

    const close = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("cross").setTooltip("Close");
    };
    const reveal = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon(REVEAL_ICON)
            .setTooltip("Show on Calendar");
    };
    const event = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon("plus-with-circle")
            .setTooltip("New Event")
            .onClick(() => {});
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
        <div class="left-nav">
            <div
                use:reveal
                on:click={() => {
                    ephemeral.displayDate($viewing);
                }}
            />
            <div use:event on:click={() => store.addEvent($viewing)} />
        </div>
        <div use:close on:click={() => ($viewing = null)} />
    </div>
    <div class="date">
        <div
            class="arrow calendar-clickable"
            use:left
            aria-label="Previous"
            on:click={() => {
                ephemeral.goToPreviousDay();

                ephemeral.displayDate($viewing);
            }}
        />
        <div class="title-container">
            <h3 class="fantasy-title title">
                <span class="current">{date}</span>
            </h3>
            {#if displayDayNumber}
                <div class="day-number">
                    <em> Day {daysBeforeDay} </em>
                </div>
            {/if}
        </div>
        <div
            class="arrow right calendar-clickable"
            use:right
            aria-label="Next"
            on:click={() => {
                ephemeral.goToNextDay();
                ephemeral.displayDate($viewing);
            }}
        />
    </div>
    {#if $displayMoons}
        <div class="moon-container">
            {#each $moons as moon}
                <MoonUI {moon} />
            {/each}
        </div>
    {/if}
    <Flags
        events={$events}
        dayView={true}
        date={$viewing}
        on:event-click
        on:event-mouseover
        on:event-context
    />
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
    .left-nav {
        display: flex;
    }
    .left-nav :global(.clickable-icon) {
        margin-right: 0;
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

    .title-container {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
    }
    .day-number {
        font-size: small;
    }
    .moon-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
