<script lang="ts">
    import { ExtraButtonComponent } from "obsidian";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let year: string;
    export let arrows = false;
    export let current: string;

    const left = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("left-arrow");
    };
    const right = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("right-arrow");
    };
    const settings = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("gear");
    };
</script>

<div class="fantasy-nav nav">
    <div class="fantasy-year-nav">
        <h2 class="fantasy-title">
            <span class="fantasy-year">{year}</span>
        </h2>
    </div>
    <div class="right-nav fantasy-right-nav">
        <div class="container">
            {#if arrows}
                <div
                    class="arrow calendar-clickable"
                    use:left
                    aria-label="Previous Year"
                    on:click={() => dispatch("previous")}
                />
            {/if}
            <div
                class="reset-button calendar-clickable"
                on:click={() => dispatch("reset")}
                aria-label="Today is {current}"
            >
                <span>Today</span>
            </div>

            {#if arrows}
                <div
                    class="arrow right calendar-clickable"
                    use:right
                    aria-label="Next Year"
                    on:click={(evt) => dispatch("next")}
                />
            {/if}
            <div
                class="calendar-clickable"
                use:settings
                aria-label="Calendar Settings"
                on:click={(evt) => dispatch("settings", evt)}
            />
        </div>
    </div>
</div>

<style>
    :global(#calendar-container) .fantasy-nav.nav.nav {
        padding: 0;
        margin: 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 2;
    }
    .fantasy-year-nav {
        display: flex;
        align-items: center;
        margin-right: auto;
    }

    .container {
        display: flex;
        align-items: center;
    }
    .fantasy-title {
        margin: 0;
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
</style>
