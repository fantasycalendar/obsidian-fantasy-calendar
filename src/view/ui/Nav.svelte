<script lang="ts">
    import { ExtraButtonComponent } from "obsidian";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let month: string;
    export let year: number;
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
    <h3 class="fantasy-title title">
        <span class="fantasy-month month">{month}</span>
        <span class="fantasy-year year">{year}</span>
    </h3>
    <div class="right-nav fantasy-right-nav">
        <div
            class="arrow calendar-clickable"
            use:left
            aria-label="Previous Month"
            on:click={() => dispatch("previous")}
        />
        <div
            class="reset-button calendar-clickable"
            on:click={() => dispatch("reset")}
            aria-label="Today is {current}"
        >
            <span>Today</span>
        </div>
        <div
            class="arrow right calendar-clickable"
            use:right
            aria-label="Next Month"
            on:click={(evt) => dispatch("next")}
        />
        <div
            class="calendar-clickable"
            use:settings
            aria-label="Calendar Settings"
            on:click={(evt) => dispatch("settings", evt)}
        />
    </div>
</div>

<style>
    .fantasy-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .fantasy-title {
        margin: 0;
    }
    .fantasy-right-nav {
        display: flex;
        justify-content: center;
        margin-left: auto;
    }
    .calendar-clickable {
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
</style>
