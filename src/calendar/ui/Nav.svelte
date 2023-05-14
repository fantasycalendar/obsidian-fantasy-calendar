<script lang="ts">
    import { ExtraButtonComponent, Menu } from "obsidian";
    import { createEventDispatcher } from "svelte";
    import { getTypedContext } from "../view";
    import { ViewState } from "src/stores/calendar.store";
    import Month from "./Month.svelte";

    const global = getTypedContext("store");
    const ephemeral = getTypedContext("ephemeralStore");
    const plugin = getTypedContext("plugin");
    const store = $global;
    const { displayingMonth, displayingYear } = ephemeral;
    const { currentDisplay } = store;
    $: displayMoons = ephemeral.displayMoons;
    $: displayWeeks = ephemeral.displayWeeks;
    $: displayDayNumber = ephemeral.displayDayNumber;
    $: viewState = ephemeral.viewState;

    const left = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("left-arrow");
    };
    const right = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("right-arrow");
    };
    const settings = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("gear");
    };
    const openSettings = (evt: MouseEvent) => {
        const menu = new Menu();

        menu.setNoIcon();

        menu.addItem((item) => {
            item.setTitle("Go to Day").onClick(() => {
                /* openDate(); */
            });
        });
        menu.addItem((item) => {
            item.setTitle(
                `Show ${$viewState == ViewState.Year ? "Month" : "Year"} View`
            ).onClick(() => {
                if ($viewState == ViewState.Year) {
                    $viewState = ViewState.Month;
                } else {
                    $viewState = ViewState.Year;
                }
            });
        });
        menu.addSeparator();
        menu.addItem((item) => {
            item.setTitle(
                `${$displayWeeks ? "Hide" : "Display"} Week Numbers`
            ).onClick(async () => {
                $displayWeeks = !$displayWeeks;
                plugin.saveCalendars();
            });
        });
        menu.addItem((item) => {
            item.setTitle(
                $displayMoons ? "Hide Moons" : "Display Moons"
            ).onClick(() => {
                $displayMoons = !$displayMoons;
            });
        });
        menu.addItem((item) => {
            item.setTitle(
                $displayDayNumber ? "Hide Day Number" : "Display Day Number"
            ).onClick(async () => {
                $displayDayNumber = !$displayDayNumber;
            });
        });

        menu.showAtMouseEvent(evt);
    };
</script>

<div class="fantasy-nav nav">
    <div class="title-container">
        <h3 class="fantasy-title title">
            {#if $viewState == ViewState.Month}
                <span class="fantasy-month month">{$displayingMonth.name}</span>
            {/if}
            <span class="fantasy-year year">{$displayingYear}</span>
        </h3>
    </div>
    <div class="right-nav fantasy-right-nav">
        <div class="container">
            <div
                class="arrow calendar-clickable"
                use:left
                on:click={() => ephemeral.goToPrevious()}
            />
            <div
                class="reset-button calendar-clickable"
                on:click={() => ephemeral.displayDate()}
                aria-label="Today is {$currentDisplay}"
            >
                <span>Today</span>
            </div>
            <div
                class="arrow right calendar-clickable"
                use:right
                on:click={(evt) => ephemeral.goToNext()}
            />
            <div
                class="calendar-clickable"
                use:settings
                aria-label="Calendar Settings"
                on:click={(evt) => openSettings(evt)}
            />
        </div>
    </div>
</div>

<style>
    .fantasy-nav.nav.nav {
        padding: 10px 0px;
        margin: 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: stretch;
    }
    .year {
        color: var(--interactive-accent);
    }
    .container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    .fantasy-title {
        margin: 0;
        line-height: 1.25;
    }
    .fantasy-right-nav {
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
    .calendar-clickable {
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
    .title-container {
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
    }
    .reset-button {
        cursor: pointer;
        border-radius: 4px;
        color: var(--text-muted);
        font-size: 0.7em;
        font-weight: 600;
        letter-spacing: 1px;
        margin: 0 4px;
        padding: 0px 4px;
        text-transform: uppercase;
    }
    .arrow {
        --icon-size: 16px;
    }
</style>
