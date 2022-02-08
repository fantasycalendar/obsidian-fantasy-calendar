<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";

    import type { Calendar, LeapDay } from "src/@types";
    import LeapDayUI from "./LeapDayInstance.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import { CreateLeapDayModal } from "src/settings/modals/leapday/leapday";
    import type FantasyCalendar from "src/main";
    import { Writable } from "svelte/store";
    import Details from "../Utilities/Details.svelte";

    export let calendar: Calendar;
    export let plugin: FantasyCalendar;

    const store = getContext<Writable<Calendar>>("store");

    store.subscribe((v) => (calendar = v));

    $: leapdays = calendar.static.leapDays;
    let disabled =
        calendar.static.months?.filter((m) => m.name?.length).length == 0;
    $: {
        disabled =
            calendar.static.months?.filter((m) => m.name?.length).length == 0;
    }

    const deleteLeapDay = (item: LeapDay) => {
        leapdays = leapdays.filter((leapday) => leapday.id !== item.id);
    };

    const add = (leapday?: LeapDay) => {
    console.log("🚀 ~ file: LeapDayContainer.svelte ~ line 33 ~ leapday", leapday);
        const modal = new CreateLeapDayModal(plugin.app, calendar, leapday);
        modal.onClose = () => {
            if (!modal.saved) return;
            if (!modal.leapday.interval.length) return;
            if (!modal.leapday.name) return;
            if (modal.editing) {
                const index = calendar.static.leapDays.findIndex(
                    (e) => e.id === modal.leapday.id
                );

                calendar.static.leapDays.splice(index, 1, {
                    ...modal.leapday
                });
            } else {
                calendar.static.leapDays.push({ ...modal.leapday });
            }
            leapdays = calendar.static.leapDays;
        };
        modal.open();
    };
</script>

<Details name={"Leap Days"}>
    <AddNew
        on:click={() => add()}
        {disabled}
        label={disabled ? "At least one named month is required" : null}
    />

    {#if !leapdays.length}
        <NoExistingItems message={"Create a new leap day to see it here."} />
    {:else}
        <div class="existing-items">
            {#each leapdays as leapday}
                <LeapDayUI
                    {leapday}
                    on:edit={() => add(leapday)}
                    on:delete={() => deleteLeapDay(leapday)}
                />
            {/each}
        </div>
    {/if}
</Details>

<style>
</style>
