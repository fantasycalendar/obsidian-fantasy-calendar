<script lang="ts">
    import { getTypedContext } from "../view";
    import Dot from "./Dot.svelte";
    import type { FcEvent, FcEventCategory } from "src/@types";

    export let events: FcEvent[] = [];

    const store = getTypedContext("store");
    const { categories } = $store;

    const color = (event: FcEvent) => {
        return $categories.find((c) => c.id == event.category)?.color;
    };
</script>

<div class="dots-container">
    <div class="dot-container centered">
        {#each events as event}
            <Dot color={color(event)} />
        {/each}
    </div>
</div>

<style>
    .dots-container {
        width: 100%;
    }
    .dot-container {
        display: flex;
        flex-flow: row nowrap;
        width: fit-content;
        margin: auto;
        line-height: 6px;
        min-height: 6px;
    }
    .centered {
        justify-content: center;
        align-items: center;
    }
</style>
