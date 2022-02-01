<script lang="ts">
    import type { Calendar } from "src/@types";
    import type FantasyCalendar from "src/main";
    import copy from "fast-copy";
    import { ExtraButtonComponent, setIcon, Setting } from "obsidian";
    import { CalendarPresetModal } from "../modals/preset";
    import { createEventDispatcher, setContext } from "svelte";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
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
    import { getCanSave, getMissingNotice, warning } from "./Utilities/utils";
    import { ConfirmExitModal } from "../modals/confirm";

    let ready = false;

    onMount(() => {
        ready = true;
    });

    const dispatch = createEventDispatcher();

    export let width: number;
    export let top: number;
    export let calendar: Calendar;
    export let plugin: FantasyCalendar;

    window.calendar = calendar;

    const store = writable<Calendar>(calendar);
    store.subscribe((v) => {
        calendar = v;
    });
    setContext<Writable<Calendar>>("store", store);

    const back = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("left-arrow-with-tail");
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

    let saved = false;

    $: missing = getMissingNotice(calendar);
    $: canSave = getCanSave(calendar);

    const checkCanSave = () => {
        if (!canSave && !plugin.data.exitWithoutSaving) {
            const modal = new ConfirmExitModal(plugin);
            modal.onClose = () => {
                if (modal.confirmed) {
                    ready = false;
                }
            };
            modal.open();
        } else {
            saved = true;
            ready = false;
        }
    };
    const savedEl = (node: HTMLElement) => {
        if (canSave) {
            setIcon(node, "checkmark");
        } else {
            warning(node);
        }
    };
</script>

<div class="fantasy-calendar-creator" style="padding-top: {top}px;">
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
                            aria-label={canSave
                                ? "Save and exit"
                                : "Exit without saving"}
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
                <Info {calendar} />
                <WeekdayContainer {calendar} />
                <MonthContainer />
                <YearContainer {calendar} app={plugin.app} />
                <CurrentDate />
                <EventContainer {plugin} {calendar} />
                <CategoryContainer {calendar} />
                <MoonContainer {plugin} {calendar} />
                <LeapDayContainer {calendar} {plugin} />
            </div>
        </div>
    {/if}
</div>

<style>
    .fantasy-calendar-creator {
        height: 100%;
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
    /* Globals */
    .fantasy-calendar-creator :global(.warning-container) {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
</style>
