<script lang="ts">
    import copy from "fast-copy";
    import { ExtraButtonComponent, Setting } from "obsidian";
    import type { Calendar } from "src/@types";
    import { DEFAULT_CALENDAR } from "src/main";
    import type FantasyCalendar from "src/main";
    import { CalendarPresetModal } from "../settings";
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import Details from "./Details.svelte";
    import Info from "./Info.svelte";
    import DateFields from "./DateFields.svelte";
    import WeekdayContainer from "./WeekdayContainer.svelte";
    import MonthContainer from "./MonthContainer.svelte";
    import YearContainer from "./YearContainer.svelte";
    import EventContainer from "./EventContainer.svelte";
    import CategoryContainer from "./CategoryContainer.svelte";
    import MoonContainer from "./MoonContainer.svelte";

    let ready = false;
    let width: number;
    let creator: HTMLDivElement;
    onMount(() => {
        width = creator.clientWidth;
        ready = true;
    });

    const dispatch = createEventDispatcher();

    export let calendar: Calendar = copy(DEFAULT_CALENDAR);
    console.log("🚀 ~ file: Creator.svelte ~ line 28 ~ calendar", calendar);
    window.calendar = calendar;
    export let plugin: FantasyCalendar;

    const back = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon("left-arrow-with-tail")
            .setTooltip("Exit Calendar Creator");
    };
    const preset = (node: HTMLElement) => {
        const presetEl = node.createDiv("fantasy-calendar-apply-preset");
        new Setting(presetEl)
            .setName("Apply Preset")
            .setDesc("Apply a common fantasy calendar as a preset.")
            .addButton((b) => {
                b.setCta()
                    .setButtonText("Choose Preset")
                    .onClick(() => {
                        const modal = new CalendarPresetModal(plugin.app);
                        modal.onClose = () => {
                            if (!modal.saved) return;
                            calendar = {
                                ...copy(modal.preset),
                                id: calendar.id
                            };
                            if (calendar?.name == "Gregorian Calendar") {
                                const today = new Date();

                                calendar.current = {
                                    year: today.getFullYear(),
                                    month: today.getMonth(),
                                    day: today.getDate()
                                };
                            }
                        };
                        modal.open();
                    });
            });
    };
</script>

<div class="fantasy-calendar-creator" bind:this={creator}>
    {#if ready}
        <div
            transition:fly={{ x: width }}
            on:introend={() => dispatch("flown")}
            on:outroend={() => dispatch("exit")}
        >
            <div class="back" use:back on:click={() => (ready = false)} />
            <div>
                <h3>Calendar Creator</h3>
                <div use:preset />
            </div>
            <Details name={"Basic Info"}>
                <Info {calendar} />
            </Details>
            <Details name={"Weekdays"}>
                <WeekdayContainer {calendar} />
            </Details>
            <Details name={"Months"}>
                <MonthContainer {calendar} />
            </Details>
            <Details name={"Years"}>
                <YearContainer {calendar} app={plugin.app} />
            </Details>

            <Details name={"Current Date"}>
                <DateFields {calendar} />
            </Details>
            <Details name={"Events"}>
                <EventContainer {calendar} />
            </Details>
            <Details name={"Categories"}>
                <CategoryContainer {calendar} />
            </Details>
            <Details name={"Moons"}>
                <MoonContainer {calendar} />
            </Details>
        </div>
    {/if}
</div>

<style>
    .fantasy-calendar-creator {
        background-color: inherit;
    }
    .back {
        width: min-content;
    }
    .back :global(.clickable-icon) {
        margin-left: 0;
    }
</style>
