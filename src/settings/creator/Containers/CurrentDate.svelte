<script lang="ts">
    import type { Calendar } from "src/@types";
    import { isValidDay, isValidMonth, isValidYear } from "src/utils/functions";
    import { getContext } from "svelte";
    import { Writable } from "svelte/store";
    import Details from "../Utilities/Details.svelte";
    import {
        warning,
        invalidDayLabel,
        invalidMonthLabel,
        invalidYearLabel
    } from "../Utilities/utils";

    let calendar: Calendar;
    const store = getContext<Writable<Calendar>>("store");

    store.subscribe((v) => (calendar = v));

    $: current = calendar.current;
    $: months = calendar.static.months;

    $: validDay = isValidDay(current.day, calendar);
    $: validMonth = isValidMonth(current.month, calendar);
    $: validYear = isValidYear(current.year, calendar);
    $: invalid = !validDay || !validMonth || !validYear;
</script>

<Details
    name={"Current Date"}
    warn={invalid}
    label={"Invalid current date specified"}
>
    <div class="fantasy-calendar-date-field-container setting-item">
        <div class="fantasy-calendar-date-field">
            <div class="warning-container">
                <label for="">Day</label>
                {#if !validDay}
                    <div use:warning />
                {/if}
            </div>
            <input
                type="number"
                spellcheck="false"
                placeholder="Day"
                class:invalid={!validDay}
                bind:value={current.day}
            />
            {#if invalid}
                <div class="setting-item-description">
                    {#if !validDay}
                        {invalidDayLabel(current.day, calendar)}
                    {/if}
                </div>
            {/if}
        </div>
        <div class="fantasy-calendar-date-field">
            <div class="warning-container">
                <label for="">Month</label>
                {#if !validMonth}
                    <div use:warning />
                {/if}
            </div>
            <select
                class="dropdown"
                bind:value={current.month}
                class:invalid={!validMonth}
            >
                {#each months.filter((m) => m.name) as month, index}
                    <option value={index}>{month.name}</option>
                {/each}
            </select>
            {#if invalid}
                <div class="setting-item-description">
                    {#if !validMonth}
                        {invalidMonthLabel(current.month, calendar)}
                    {/if}
                </div>
            {/if}
        </div>
        <div class="fantasy-calendar-date-field">
            <div class="warning-container">
                <label for="">Year</label>
                {#if !validYear}
                    <div use:warning />
                {/if}
            </div>
            <input
                type="number"
                spellcheck="false"
                placeholder="Year"
                class:invalid={!validYear}
                bind:value={current.year}
            />
            {#if invalid}
                <div class="setting-item-description">
                    {#if !validYear}
                        {invalidYearLabel(current.year, calendar)}
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</Details>

<style>
    .fantasy-calendar-date-field-container.fantasy-calendar-date-field-container {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        border: 0;
    }
    .fantasy-calendar-date-field {
        display: grid;
        grid-auto-rows: 1fr;
        flex: 1 1 0;
        gap: 0.5rem;
    }

    .fantasy-calendar-date-field .setting-item-description {
        padding-top: 0;
    }

    .fantasy-calendar-date-field .invalid {
        border: 1px solid var(--text-error);
    }
</style>
