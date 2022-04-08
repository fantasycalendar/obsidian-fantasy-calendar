<script lang="ts">
    import type { Calendar, CurrentCalendarData } from "src/@types";

    import { isValidDay, isValidMonth, isValidYear } from "src/utils/functions";
    import { createEventDispatcher } from "svelte";
    import {
        warning,
        invalidDayLabel,
        invalidMonthLabel,
        invalidYearLabel
    } from "../Utilities/utils";

    const dispatch = createEventDispatcher();

    export let calendar: Calendar;
    export let date: CurrentCalendarData;

    $: months = calendar.static.months;

    $: validDay = isValidDay(date.day, calendar);
    $: validMonth = isValidMonth(date.month, calendar);
    $: validYear = isValidYear(date.year, calendar);
    $: invalid = !validDay || !validMonth || !validYear;

    $: {
        dispatch("date-change", date);
    }
</script>

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
            bind:value={date.day}
        />
        {#if invalid}
            <div class="setting-item-description">
                {#if !validDay}
                    {invalidDayLabel(date.day, calendar)}
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
            bind:value={date.month}
            class:invalid={!validMonth}
        >
            {#each months.filter((m) => m.name) as month, index}
                <option value={index}>{month.name}</option>
            {/each}
        </select>
        {#if invalid}
            <div class="setting-item-description">
                {#if !validMonth}
                    {invalidMonthLabel(date.month, calendar)}
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
            bind:value={date.year}
        />
        {#if invalid}
            <div class="setting-item-description">
                {#if !validYear}
                    {invalidYearLabel(date.year, calendar)}
                {/if}
            </div>
        {/if}
    </div>
</div>

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
