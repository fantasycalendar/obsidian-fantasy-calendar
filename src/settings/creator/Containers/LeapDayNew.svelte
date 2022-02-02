<script lang="ts">
    import type { Calendar, LeapDay } from "src/@types";
    import { nanoid } from "src/utils/functions";
    import TextComponent from "../Settings/TextComponent.svelte";
    import ToggleComponent from "../Settings/ToggleComponent.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import Details from "../Utilities/Details.svelte";

    export let leapDay: LeapDay = {
        id: nanoid(6),
        name: "Leap Day",
        interval: [],
        intercalary: false,
        timespan: null,
        offset: 0,
        type: "leapday"
    };
    $: ic = leapDay.intercalary;

    export let calendar: Calendar;
    $: months = calendar.static.months;

    window.leapday = leapDay;
</script>

<TextComponent
    name={"Name"}
    value={leapDay.name}
    on:blur={(evt) => (leapDay.name = evt.detail)}
/>
<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">Month</div>
        <div class="setting-item-description">
            The leap day will be added to this month.
        </div>
    </div>
    <div class="setting-item-control">
        <select class="dropdown" bind:value={leapDay.timespan}>
            <option selected hidden disabled>Select a Weekday</option>
            {#each months.filter((v) => v.name?.length) as month, index}
                <option value={index}>
                    {month.name ?? ""}
                </option>
            {/each}
        </select>
    </div>
</div>

<ToggleComponent
    name="Intercalary"
    value={leapDay.intercalary}
    desc="Intercalary days interrupt the normal flow of the month."
    on:click={(evt) => (leapDay.intercalary = !leapDay.intercalary)}
/>

{#if ic}
    <div class="intercalary-settings">
        <div class="numbered intercalary-field">
            <input
                id="numbered"
                type="checkbox"
                bind:value={leapDay.numbered}
            />
            <label for="numbered">Numbered</label>
        </div>
        <div class="after intercalary-field">
            <label for="after">After</label>
            <select class="dropdown" />
        </div>
    </div>
{/if}

<Details name="Conditions" open={true}>
    <TextComponent
        type="number"
        name="Offset"
        desc="Offset the year the leap day is applied to."
        value={`${leapDay.offset}`}
        on:blur={(evt) => (leapDay.offset = evt.detail)}
    />
    <AddNew />
</Details>

<style>
    .intercalary-settings {
        display: flex;
        justify-content: space-around;
    }
</style>
