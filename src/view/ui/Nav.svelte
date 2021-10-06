<script lang="ts">
    import { ExtraButtonComponent } from "obsidian";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let month: string;
    export let year: number;

    const left = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("left-arrow").onClick(() => {
            dispatch("previous");
        });
    };
    const right = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("right-arrow").onClick(() => {
            dispatch("next");
        });
    };
</script>

<div class="fantasy-nav nav">
    <h3 class="fantasy-title title">
        <span class="fantasy-month month">{month}</span>
        <span class="fantasy-year year">{year}</span>
    </h3>
    <div class="right-nav fantasy-right-nav">
        <div class="arrow" use:left aria-label="Previous Month" />
        <div class="reset-button" on:click={() => dispatch("reset")}>
            <span>Today</span>
        </div>
        <div class="arrow right" use:right aria-label="Next Month" />
    </div>
</div>

<style>
    .fantasy-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    .fantasy-title {
        margin: 0;
    }
    .fantasy-right-nav {
        display: flex;
        justify-content: center;
        margin-left: auto;
    }
    .arrow {
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
</style>
