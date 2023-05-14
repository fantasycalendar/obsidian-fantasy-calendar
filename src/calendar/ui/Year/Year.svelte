<script lang="ts">
    import { getTypedContext } from "src/calendar/view";
    import Month from "../Month.svelte";

    let yearContainer: HTMLDivElement;

    const global = getTypedContext("store");
    $: store = $global;
    $: yearCalculator = store.yearCalculator;

    const ephemeral = getTypedContext("ephemeralStore");
    $: displaying = ephemeral.displaying;

    $: yearStore = yearCalculator.getYearFromCache($displaying.year);
    $: monthArray = store.staticStore.months;
    $: console.log("🚀 ~ file: Year.svelte:16 ~ monthArray:", monthArray);

    /* const months = $monthArray.map((m) =>
        yearStore.getMonthFromCache($monthArray.indexOf(m))
    ); */
</script>

<div class="year-view">
    <div class="year" bind:this={yearContainer}>
        {#each $monthArray as month, index}
            <Month year={$displaying.year} month={index} />
        {/each}
    </div>
</div>

<style scoped>
    .year-view {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .year {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        overflow: auto;
        flex: 1;
    }
</style>
