<script lang="ts">
    import { App, ButtonComponent, ExtraButtonComponent } from "obsidian";
    import type { Calendar, LeapDay, LeapDayCondition } from "src/@types";
    import { IntervalModal } from "src/settings/modals/leapday/leapday";
    import { getIntervalDescription } from "src/utils/functions";
    import { createEventDispatcher } from "svelte";
    import TextComponent from "../../creator/Settings/TextComponent.svelte";
    import ToggleComponent from "../../creator/Settings/ToggleComponent.svelte";
    import AddNew from "../../creator/Utilities/AddNew.svelte";
    import Details from "../../creator/Utilities/Details.svelte";

    const dispatch = createEventDispatcher();

    export let app: App;
    export let leapDay: LeapDay;
    $: ic = leapDay.intercalary;

    export let calendar: Calendar;
    $: months = calendar.static.months;
    $: selected = months[leapDay.timespan];
    $: days = selected.length
        ? [...Array(selected.length).keys()].map((k) => k + 1)
        : [];

    const add = (interval?: LeapDayCondition) => {
        const modal = new IntervalModal(
            app,
            leapDay.interval.length > 0,
            interval
        );
        modal.onClose = () => {
            if (!modal.saved) return;
            if (!modal.condition.interval) return;
            if (!interval) {
                leapDay.interval.push(modal.condition);
            } else {
                leapDay.interval.splice(
                    leapDay.interval.indexOf(interval),
                    1,
                    modal.condition
                );
            }
            leapDay.interval = leapDay.interval;
        };
        modal.open();
    };

    $: intervals = leapDay.interval.sort((a, b) => a.interval - b.interval);
    const getIntervalName = (interval: LeapDayCondition) => {
        const name = [`${interval.interval}`];
        if (interval.exclusive) {
            name.push("(Exclusive)");
        }
        if (interval.ignore) {
            name.push(" - Ignoring Offset");
        }
        return name.join(" ");
    };
    const edit = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("pencil");
    };
    const trash = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("trash");
    };

    const cancel = (node: HTMLElement) => {
        new ButtonComponent(node).setButtonText("Cancel").setCta();
    };
</script>

<div class="fantasy-calendar-nested-settings">
    <TextComponent
        name={"Name"}
        value={leapDay.name}
        warn={!leapDay.name}
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
                {#each months as month, index}
                    <option value={index} selected={index == leapDay.timespan}>
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
        <div class="setting-item intercalary-settings">
            <div class="numbered intercalary-field">
                <input
                    id="numbered"
                    type="checkbox"
                    checked={leapDay.numbered}
                    on:change={() => (leapDay.numbered = !leapDay.numbered)}
                />
                <label for="numbered">Numbered</label>
            </div>
            <div class="after intercalary-field">
                <label for="after">After</label>
                <select class="dropdown" bind:value={leapDay.after}>
                    <option selected={leapDay.after == 0} value="0"
                        >Before 1</option
                    >
                    {#each days as day}
                        <option selected={leapDay.after == day}>{day}</option>
                    {/each}
                </select>
            </div>
        </div>
    {/if}
</div>

<Details
    name="Conditions"
    open={true}
    warn={!leapDay.interval.length}
    label={"At least one condition is required"}
>
    <TextComponent
        type="number"
        name="Offset"
        desc="Offset the year the leap day is applied to."
        value={`${leapDay.offset}`}
        on:blur={(evt) => (leapDay.offset = evt.detail)}
    />
    <AddNew on:click={() => add()} />
    <div class="setting-item">
        <div class="setting-item-description">
            {getIntervalDescription(leapDay)}
        </div>
    </div>
    {#each intervals as interval}
        <div class="setting-item">
            <div class="setting-item-info">
                <div class="setting-item-name">{getIntervalName(interval)}</div>
            </div>
            <div class="setting-item-control">
                <div use:edit on:click={() => add(interval)} />
                <div
                    use:trash
                    on:click={() =>
                        (leapDay.interval = leapDay.interval.filter(
                            (i) => i != interval
                        ))}
                />
            </div>
        </div>
    {/each}
</Details>
<div class="buttons">
    <div use:cancel on:click={() => dispatch("cancel")} />
</div>

<style>
    .intercalary-settings {
        display: flex;
        justify-content: space-around;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }
</style>
