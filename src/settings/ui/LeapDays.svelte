<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { LeapDay } from "src/@types";

    import Detail from "./Detail.svelte";
    import LeapDayUI from "./LeapDay.svelte";

    export let leapdays: LeapDay[] = [];

    const dispatch = createEventDispatcher();

    const editLeapDay = (item: LeapDay) => {
        dispatch("new-item", item);
    };
    const deleteLeapDay = (item: LeapDay) => {
        leapdays = leapdays.filter((leapday) => leapday.id !== item.id);
        dispatch("edit-leapdays", leapdays);
    };
</script>

<Detail label="Leap Days" on:new-item>
    {#if !leapdays.length}
        <div class="existing-items">
            <span>Create a new leap day to see it here.</span>
        </div>
    {:else}
        <div class="existing-items">
            {#each leapdays as leapday}
                <LeapDayUI
                    {leapday}
                    on:edit={() => editLeapDay(leapday)}
                    on:delete={() => deleteLeapDay(leapday)}
                />
            {/each}
        </div>
    {/if}
</Detail>

<style>
</style>
