<script lang="ts">
    import type { Calendar as CalendarInterface } from "src/@types";
    import type FantasyCalendar from "src/main";
    import Calendar from "./Calendar.svelte";
    import { setContext } from "svelte";
    import { CalendarStore } from "src/stores/calendar.store";
    import { setTypedContext } from "../view";
    import { writable } from "svelte/store";

    export let calendar: CalendarInterface;
    export let plugin: FantasyCalendar;
    setTypedContext("plugin", plugin);

    const store = writable(plugin.getStore(calendar));
    if (store) {
        setTypedContext("store", store);
    }
</script>

{#if !store}
    <p>No calendar selected.</p>
{:else}
    <div class="calendar-container fantasy-calendar">
        <Calendar />
    </div>
{/if}

<style scoped>
    .calendar-container {
        padding: 0 8px;
    }
</style>
