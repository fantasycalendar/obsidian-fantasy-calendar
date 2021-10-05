<script lang="ts">
    export let days: number[];
    export let columns: number;
    export let rows: number;
</script>

<div
    class="fantasy-month"
    style="--calendar-columns: {columns}; --calendar-rows: {rows};"
>
    {#each days as day}
        <span>
            {day}
        </span>
    {/each}
</div>

<style>
    .fantasy-month {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), 1fr);
        grid-template-rows: repeat(var(--calendar-rows), 1fr);
    }
    span {
        text-align: center;
    }
</style>
