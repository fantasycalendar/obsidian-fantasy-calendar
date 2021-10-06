<script lang="ts">
    import Dot from "./Dot.svelte";
    import type { Event } from "src/@types";

    export let centered: boolean = true;
    export let events: Event[] = [];

    const MAX_DOTS_PER_SOURCE = 3;
</script>

<div class="dot-container" class:centered>
    {#each events.slice(0, MAX_DOTS_PER_SOURCE) as event}
        <Dot/>
    {/each}
</div>

<style>
    .dot-container {
        display: flex;
        flex-wrap: wrap;
        line-height: 6px;
        min-height: 6px;
    }
    .centered {
        justify-content: center;
    }
</style>
