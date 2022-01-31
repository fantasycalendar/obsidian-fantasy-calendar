<script lang="ts">
    import type { Calendar } from "src/@types";
    import type FantasyCalendar from "src/main";
    import copy from "fast-copy";
    import { ExtraButtonComponent, Notice, setIcon, Setting } from "obsidian";
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
    let creator: HTMLDivElement;

    onMount(() => {
        ready = true;
    });

    const dispatch = createEventDispatcher();

    export let width: number;
    export let top: number;
    export let calendar: Calendar;
    $: window.calendar = calendar;
    export let plugin: FantasyCalendar;

    const store = writable<Calendar>(calendar);
    store.subscribe((v) => {
        calendar = v;
    });
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

    let y = 0;
    let saved = false;

    let canSave = false;
    let missing: string;
    $: {
        let missingArr: string[] = [];

        if (!calendar.name?.length) {
            missingArr.push("A calendar must have a name.");
        }
        if (!calendar.static.weekdays?.length) {
            missingArr.push("A calendar must have at least 1 weekday.");
        } else {
            if (!calendar.static.weekdays?.every((d) => d.name?.length)) {
                const length = calendar.static.weekdays?.filter(
                    (d) => !d.name?.length
                ).length;
                if (length == 1) {
                    missingArr.push(`${length} weekday does not have a name.`);
                } else {
                    missingArr.push(`${length} weekdays do not have names.`);
                }
            }
            if (
                calendar.static.firstWeekDay >=
                (calendar.static.weekdays?.length ?? Infinity)
            ) {
                missingArr.push(
                    `Invalid first weekday selection: ${
                        calendar.static.weekdays[calendar.static.firstWeekDay]
                    }`
                );
            }
        }
        if (!calendar.static.months?.length) {
            missingArr.push("A calendar must have at least 1 month.");
        } else {
            if (!calendar.static.months?.every((m) => m.name?.length)) {
                const length = calendar.static.months?.filter(
                    (m) => !m.name?.length
                ).length;
                if (length == 1) {
                    missingArr.push(`${length} month does not have a name.`);
                } else {
                    missingArr.push(`${length} months do not have names.`);
                }
            }
            if (!calendar.static.months?.every((m) => m.length > 0)) {
                const length = calendar.static.months?.filter(
                    (m) => !(m.length > 0)
                ).length;
                if (length == 1) {
                    missingArr.push(`${length} month does not have a length.`);
                } else {
                    missingArr.push(`${length} months do not have lengths.`);
                }
            }
        }
        if (calendar.static.useCustomYears) {
            if (!calendar.static.years?.length) {
                missingArr.push(
                    `Use Custom Years is on but no years have been created.`
                );
            } else if (!calendar.static.years.every((y) => y.name?.length)) {
                const length = calendar.static.years.filter(
                    (y) => !y.name?.length
                ).length;
                if (length == 1) {
                    missingArr.push(`${length} year does not have a name.`);
                } else {
                    missingArr.push(`${length} years do not have names.`);
                }
            }
        }
        missing = missingArr.join("\n");
    }
    $: {
        if (
            calendar.static.months?.length &&
            calendar.static.months?.every((m) => m.name?.length) &&
            calendar.static.months?.every((m) => m.length > 0) &&
            calendar.static.weekdays?.length &&
            calendar.static.weekdays?.every((d) => d.name?.length) &&
            calendar.name?.length &&
            calendar.static.firstWeekDay <
                (calendar.static.weekdays?.length ?? Infinity) &&
            (!calendar.static.useCustomYears ||
                (calendar.static.useCustomYears &&
                    calendar.static.years?.length &&
                    calendar.static.years.every((y) => y.name?.length)))
        ) {
            canSave = true;
        } else {
            canSave = false;
        }
    }
    const checkCanSave = () => {
        if (!canSave) {
            new Notice(missing);
            return;
        }
        saved = true;
        ready = false;
    };
    const savedEl = (node: HTMLElement) => {
        if (canSave) {
            setIcon(node, "checkmark");
        } else {
            setIcon(node, "fantasy-calendar-warning");
        }
    };
</script>

<div
    class="fantasy-calendar-creator"
    bind:this={creator}
    style="padding-top: {top}px;"
>
    {#if ready}
        <div
            class="inherit fantasy-calendar-creator-inner"
            style="width: {width}px;"
            transition:fly={{ x: width * 1.5, opacity: 1 }}
            on:introend={() => dispatch("flown")}
            on:outroend={() => dispatch("exit", { saved, calendar })}
        >
            <div class="top-nav">
                <div class="icons">
                    <div class="left">
                        <div
                            class="back"
                            use:back
                            on:click={() => {
                                checkCanSave();
                            }}
                        />
                        <div class="check">
                            {#if canSave}
                                <div
                                    class="save can-save"
                                    use:savedEl
                                    aria-label={missing}
                                />
                            {:else}
                                <div
                                    class="save"
                                    use:savedEl
                                    aria-label={missing}
                                />
                                <span class="additional">
                                    Additional information is required before
                                    saving
                                </span>
                            {/if}
                        </div>
                    </div>
                    <div
                        class="cancel"
                        use:cancel
                        on:click={() => (ready = false)}
                    />
                </div>
                <h3 class="fantasy-calendar-creator-header">
                    Calendar Creator
                </h3>
            </div>
            <div class="fantasy-creator-app">
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
    .fantasy-calendar-creator {
        position: absolute;
        top: 0;
    }
    .fantasy-calendar-creator-inner {
        position: absolute;
        top: 0;
        left: 0;
    }
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
        top: 0;
        padding: 10px 0px;
        background-color: inherit;
        z-index: 1;
    }
    .icons {
        display: flex;
        justify-content: space-between;
    }

    .icons .left {
        display: flex;
        align-items: center;
    }
    .check {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }
    .additional {
        color: var(--text-faint);
    }
    .save {
        color: var(--text-error);
    }
    .save.can-save {
        color: var(--interactive-success);
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
