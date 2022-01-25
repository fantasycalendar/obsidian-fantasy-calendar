<script lang="ts">
    import copy from "fast-copy";
    import { ExtraButtonComponent, Setting } from "obsidian";
    import type { Calendar } from "src/@types";
    import { DEFAULT_CALENDAR } from "src/main";
    import type FantasyCalendar from "src/main";
    import { CalendarPresetModal } from "../settings";
    import { createEventDispatcher, setContext } from "svelte";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import Details from "./Details.svelte";
    import { writable, Writable } from "svelte/store";
    import Info from "./Info.svelte";
    import DateFields from "./DateFields.svelte";
    import Weekdays from "./Weekdays.svelte";

    let ready = false;
    let width: number;
    let creator: HTMLDivElement;
    onMount(() => {
        width = creator.clientWidth;
        ready = true;
    });

    const dispatch = createEventDispatcher();

    export let calendar: Calendar = copy(DEFAULT_CALENDAR);
    export let plugin: FantasyCalendar;

    const store: Writable<Calendar> = writable(calendar);

    setContext("store", store);

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
                <Info />
            </Details>
            <Details name={"Weekdays"}>
                <Weekdays />
            </Details>
            <Details name={"Months"} />
            <Details name={"Years"} />

            <Details name={"Current Date"}>
                <DateFields {calendar} />
            </Details>
            <Details name={"Events"} />
            <Details name={"Categories"} />
            <Details name={"Moons"} />
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
