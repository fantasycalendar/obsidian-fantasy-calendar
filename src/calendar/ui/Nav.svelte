<script lang="ts">
    import { ExtraButtonComponent, Menu } from "obsidian";
    import { createEventDispatcher } from "svelte";
    import { getTypedContext } from "../view";

    const global = getTypedContext("store");
    const plugin = getTypedContext("plugin");
    const store = $global;
    const { displayingMonth, displayingYear, currentDisplay, staticStore } =
        store;
    const { staticConfiguration } = staticStore;
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
        const menu = new Menu(app);

        menu.setNoIcon();
        menu.addItem((item) => {
            item.setTitle(
                `${$store.displayWeeks ? "Hide" : "Show"} Weeks`
            ).onClick(async () => {
                $store.displayWeeks = !$store.displayWeeks;
                plugin.saveCalendars();
            });
        });
        menu.addItem((item) => {
            item.setTitle(`Open ${true ? "Month" : "Year"}`).onClick(() => {});
        });
        menu.addItem((item) => {
            item.setTitle(
                $store.static.displayMoons ? "Hide Moons" : "Display Moons"
            ).onClick(() => {
                $store.static.displayMoons = !$store.static.displayMoons;
            });
        });
        menu.addItem((item) => {
            item.setTitle(
                $store.static.displayDayNumber
                    ? "Hide Day Number"
                    : "Display Day Number"
            ).onClick(async () => {
                $store.static.displayDayNumber =
                    !$store.static.displayDayNumber;
            });
        });
        menu.addItem((item) => {
            item.setTitle("View Day").onClick(() => {
                /* openDate(); */
            });
        });

        menu.showAtMouseEvent(evt);
    };
</script>

<div class="fantasy-nav nav">
    <div class="title-container">
        <h3 class="fantasy-title title">
            <span class="fantasy-month month">{$displayingMonth.name}</span>
            <span class="fantasy-year year">{$displayingYear}</span>
        </h3>
    </div>
    <div class="right-nav fantasy-right-nav">
        <div class="container">
            <div
                class="arrow calendar-clickable"
                use:left
                on:click={() => store.goToPrevious()}
            />
            <div
                class="reset-button calendar-clickable"
                on:click={() => store.displayDate()}
                aria-label="Today is {$currentDisplay}"
            >
                <span>Today</span>
            </div>
            <div
                class="arrow right calendar-clickable"
                use:right
                on:click={(evt) => store.goToNext()}
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
