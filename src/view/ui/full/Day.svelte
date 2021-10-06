<script lang="ts">
    import type { DayHelper } from "src/calendar";

    export let day: DayHelper;
    export let adjacent: boolean;
</script>

<div
    class:day={true}
    class:fantasy-day={true}
    class={adjacent ? "adjacent-month fantasy-adjacent-month" : ""}
>
    <span>
        {day.number}
    </span>
    <div class="dot-container fantasy-dot-container" />
</div>

<style>
    .dot-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        line-height: 6px;
        min-height: 6px;
    }
    .day {
        background-color: var(--color-background-day);
        border-radius: 4px;
        color: var(--color-text-day);
        cursor: pointer;
        font-size: 0.8em;
        height: 100%;
        padding: 4px;
        position: relative;
        text-align: center;
        transition: background-color 0.1s ease-in, color 0.1s ease-in;
        vertical-align: baseline;
    }
    .adjacent-month {
        opacity: 0.25;
    }
</style>
