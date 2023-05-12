<script lang="ts">
    import type { Calendar, FcDate } from "src/@types";

    import { getContext } from "svelte";
    import {
        warning,
        invalidDayLabel,
        invalidMonthLabel,
        invalidYearLabel
    } from "../Utilities/utils";

    const calendar = getContext("store");
    const {
        monthStore,
        validDay,
        validMonth,
        validYear,
        yearStore,
        currentStore
    } = calendar;
</script>

<div class="fantasy-calendar-date-field-container setting-item">
    <div class="fantasy-calendar-date-field">
        <div class="warning-container">
            <label for="">Day</label>
            {#if !$validDay}
                <div use:warning />
                <div class="setting-item-description">
                    {#if !$validDay}
                        {invalidDayLabel($currentStore.day, $calendar)}
                    {/if}
                </div>
            {/if}
        </div>
        <input
            type="number"
            spellcheck="false"
            placeholder="Day"
            class:invalid={!$validDay}
            bind:value={$currentStore.day}
        />
    </div>
    <div class="fantasy-calendar-date-field">
        <div class="warning-container">
            <label for="">Month</label>
            {#if !$validMonth}
                <div use:warning />
                <div class="setting-item-description">
                    {#if !$validMonth}
                        {invalidMonthLabel($currentStore.month, $calendar)}
                    {/if}
                </div>
            {/if}
        </div>
        <select
            class="dropdown"
            bind:value={$currentStore.month}
            class:invalid={!$validMonth}
        >
            {#each $monthStore.filter((m) => m.name) as month, index}
                <option value={index}>{month.name}</option>
            {/each}
        </select>
    </div>
    <div class="fantasy-calendar-date-field">
        <div class="warning-container">
            <label for="">Year</label>
            {#if !$validYear}
                <div use:warning />
                <div class="setting-item-description">
                    {#if !$validYear}
                        {invalidYearLabel($currentStore.year, $calendar)}
                    {/if}
                </div>
            {/if}
        </div>
        {#if $calendar.static.useCustomYears}
            <select
                class="dropdown"
                bind:value={$currentStore.year}
                class:invalid={!$validYear}
            >
                {#each $yearStore?.filter((m) => m.name) as year, index}
                    <option value={index + 1}>{year.name}</option>
                {/each}
            </select>
        {:else}
            <input
                type="number"
                spellcheck="false"
                placeholder="Year"
                class:invalid={!$validYear}
                bind:value={$currentStore.year}
            />
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
    .warning-container {
        position: relative;
        display: grid;
        align-items: center;
        gap: 0.25rem;
        grid-template-columns: 1fr auto;
    }
</style>
