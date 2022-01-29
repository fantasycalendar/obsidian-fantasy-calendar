<script lang="ts">
    import type { Calendar } from "src/@types";
    import type FantasyCalendar from "src/main";
    import copy from "fast-copy";
    import { ExtraButtonComponent, Setting } from "obsidian";
    import { CalendarPresetModal } from "../modals/preset";
    import { createEventDispatcher, setContext } from "svelte";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import Details from "./Utilities/Details.svelte";
    import CurrentDate from "./Containers/CurrentDate.svelte";
    import Info from "./Containers/Info.svelte";
    import WeekdayContainer from "./Containers/WeekdayContainer.svelte";
    import MonthContainer from "./Containers/MonthContainer.svelte";
    import YearContainer from "./Containers/YearContainer.svelte";
    import EventContainer from "./Containers/EventContainer.svelte";
    import CategoryContainer from "./Containers/CategoryContainer.svelte";
    import MoonContainer from "./Containers/MoonContainer.svelte";
    import LeapDayContainer from "./Containers/LeapDayContainer.svelte";
    import { Writable, writable } from "svelte/store";

    let ready = false;
    let width: number;
    let creator: HTMLDivElement;
    onMount(() => {
        width = creator.clientWidth;
        ready = true;
    });

    const dispatch = createEventDispatcher();

    export let calendar: Calendar;
    $: window.calendar = calendar;
    export let plugin: FantasyCalendar;

    const store = writable<Calendar>(calendar);
    setContext<Writable<Calendar>>("store", store);

    const back = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon("left-arrow-with-tail")
            .setTooltip("Save and exit");
    };
    const cancel = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon("cross")
            .setTooltip("Exit without saving");
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
                            store.set(calendar);
                        };
                        modal.open();
                    });
            });
    };

    let y: number;
</script>

<div class="fantasy-calendar-creator" bind:this={creator}>
    {#if ready}
        <div
            class="inherit fantasy-calendar-creator-inner"
            transition:fly={{ x: width }}
            on:introend={() => dispatch("flown")}
            on:outroend={() => dispatch("exit")}
        >
            <div class="top-nav">
                <div class="icons">
                    <div
                        class="back"
                        use:back
                        on:click={() => (ready = false)}
                    />
                    <div
                        class="cancel"
                        use:cancel
                        on:click={() => (ready = false)}
                    />
                </div>
                <h3
                    class="fantasy-calendar-creator-header"
                    style="font-size: calc(var(--h1) - {y ?? 0}px);"
                >
                    Calendar Creator
                </h3>
            </div>
            <div class="fantasy-creator-app" on:scroll={(evt) => y++}>
                <div use:preset />
                <!-- <div class="left-nav">
                    <div use:info />
                    <div>
                        <div class=" clickable-icon">W</div>
                    </div>
                    <div>
                        <div class=" clickable-icon">M</div>
                    </div>
                    <div>
                        <div class=" clickable-icon">Y</div>
                    </div>
                    <div>
                        <div class=" clickable-icon">D</div>
                    </div>
                    <div>
                        <div class=" clickable-icon">E</div>
                    </div>
                    <div>
                        <div class=" clickable-icon">C</div>
                    </div>
                    <div use:moons />
                </div> -->
                <Details name={"Basic Info"}>
                    <Info {calendar} />
                </Details>
                <Details name={"Weekdays"}>
                    <WeekdayContainer {calendar} />
                </Details>
                <Details name={"Months"}>
                    <MonthContainer />
                </Details>
                <Details name={"Years"}>
                    <YearContainer {calendar} app={plugin.app} />
                </Details>

                <Details name={"Current Date"}>
                    <CurrentDate />
                </Details>
                <Details name={"Events"}>
                    <EventContainer {plugin} {calendar} />
                </Details>
                <Details name={"Categories"}>
                    <CategoryContainer {calendar} />
                </Details>
                <Details name={"Moons"}>
                    <MoonContainer {plugin} {calendar} />
                </Details>
                <Details name={"Leap Days"}>
                    <LeapDayContainer {calendar} {plugin} />
                </Details>
            </div>
        </div>
    {/if}
</div>

<style>
    .fantasy-calendar-creator,
    .fantasy-calendar-creator-inner,
    .fantasy-creator-app {
        height: 100%;
        background-color: inherit;
    }
    .fantasy-creator-app {
        overflow: auto;
    }
    .fantasy-calendar-creator-header {
        margin: 0;
    }
    .top-nav {
        position: sticky;
        top: 0px;
        padding: 10px 0px;
        background-color: inherit;
        z-index: 1;
    }
    .icons {
        display: flex;
        justify-content: space-between;
    }
    /* .fantasy-creator-app {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.25rem;
        align-items: center;
    }
    .left-nav {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: center;
    } */
    .back {
        width: min-content;
    }
    .back :global(.clickable-icon) {
        margin-left: 0;
    }
</style>
