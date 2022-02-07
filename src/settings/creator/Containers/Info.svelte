<script lang="ts">
    import type { Calendar } from "src/@types";
    import type FantasyCalendar from "src/main";
    import {
        normalizePath,
        TextComponent as ObsidianTextComponent,
        TFolder
    } from "obsidian";
    import { FolderSuggestionModal } from "src/suggester/folder";
    import { getContext } from "svelte";
    import { Writable } from "svelte/store";
    import TextAreaComponent from "../Settings/TextAreaComponent.svelte";
    import TextComponent from "../Settings/TextComponent.svelte";
    import ToggleComponent from "../Settings/ToggleComponent.svelte";
    import Details from "../Utilities/Details.svelte";

    export let plugin: FantasyCalendar;
    export let calendar: Calendar;

    const store = getContext<Writable<Calendar>>("store");
    store.subscribe((v) => (calendar = v));

    $: displayDayNumber = calendar.static.displayDayNumber;
    $: incrementDay = calendar.static.incrementDay;

    $: validName = calendar.name != null && calendar.name.length;

    $: autoParse = calendar.autoParse;

    const folder = (node: HTMLElement) => {
        let folders = plugin.app.vault
            .getAllLoadedFiles()
            .filter((f) => f instanceof TFolder);
        const text = new ObsidianTextComponent(node);
        if (!calendar.path) calendar.path = "/";
        text.setPlaceholder(calendar.path ?? "/");
        const modal = new FolderSuggestionModal(plugin.app, text, [
            ...(folders as TFolder[])
        ]);

        modal.onClose = async () => {
            const v = text.inputEl.value?.trim()
                ? text.inputEl.value.trim()
                : "/";
            calendar.path = normalizePath(v);
        };

        text.inputEl.onblur = async () => {
            const v = text.inputEl.value?.trim()
                ? text.inputEl.value.trim()
                : "/";
            calendar.path = normalizePath(v);
        };
    };
</script>

<Details
    name={"Basic Info"}
    warn={!validName}
    label={"The calendar must have a name"}
>
    <div class="fantasy-calendar-info">
        <TextComponent
            name={"Calendar Name"}
            warn={!validName}
            desc={!validName ? "The calendar must have a name" : ""}
            value={calendar.name}
            on:blur={(evt) => {
                calendar.name = evt.detail;
                store.set(calendar);
            }}
        />
        <TextAreaComponent
            name={"Calendar Description"}
            value={calendar.description}
            on:blur={(evt) => (calendar.description = evt.detail)}
        />
        <ToggleComponent
            name={"Display Day Number"}
            desc={"Display day of year in Day View"}
            value={displayDayNumber}
            on:click={() => {
                calendar.static.displayDayNumber =
                    !calendar.static.displayDayNumber;
            }}
        />
        <ToggleComponent
            name={"Auto Increment Day"}
            desc={"Automatically increment the current day every real-world day."}
            value={incrementDay}
            on:click={() => {
                calendar.static.incrementDay = !calendar.static.incrementDay;
            }}
        />
        <ToggleComponent
            name={"Parse Files for Events"}
            desc={"The plugin will automatically parse files in the vault for events."}
            value={autoParse}
            on:click={() => {
                calendar.autoParse = !calendar.autoParse;
            }}
        />
        {#if autoParse}
            <TextComponent
                name={"Events Folder"}
                desc={"The plugin will only parse files in this folder for events."}
                value={calendar.path}
            >
                <div use:folder />
            </TextComponent>
        {/if}
    </div>
</Details>

<style>
    .fantasy-calendar-info :global(.setting-item) {
        padding-top: 18px;
    }
    .fantasy-calendar-info :global(.fantasy-calendar-description) {
        display: flex;
        flex-flow: column;
        align-items: flex-start;
    }
    .fantasy-calendar-info
        :global(.fantasy-calendar-description)
        :global(textarea) {
        width: 100%;
    }
</style>
