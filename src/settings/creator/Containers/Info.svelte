<script lang="ts">
    import type { Calendar } from "src/@types";
    import type FantasyCalendar from "src/main";
    import {
        ExtraButtonComponent,
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
    import { DEFAULT_CALENDAR } from "src/main";

    export let plugin: FantasyCalendar;
    export let calendar: Calendar;

    const store = getContext<Writable<Calendar>>("store");
    store.subscribe((v) => (calendar = v));

    $: displayDayNumber = calendar.static.displayDayNumber;
    $: incrementDay = calendar.static.incrementDay;

    $: validName = calendar.name != null && calendar.name.length;

    $: autoParse = calendar.autoParse;

    $: timelines = calendar.supportTimelines;

    if (!calendar.timelineTag)
        calendar.timelineTag = DEFAULT_CALENDAR.timelineTag;

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

    $: timelinesDesc = createFragment((e) => {
        e.createSpan({
            text: "Support "
        });
        e.createEl("code", { text: "<span>" });
        e.createSpan({ text: " elements used by the " });
        e.createEl("a", {
            text: "Obsidian Timelines",
            href: "obsidian://show-plugin?id=obsidian-timelines"
        });
        e.createSpan({
            text: " plugin (by Darakah)."
        });
    });
    $: timelinesTagDesc = createFragment((e) => {
        e.createSpan({
            text: "Tag to specify which notes to include in created timelines, e.g. "
        });
        e.createEl("code", { text: "timeline" });
        e.createSpan({
            text: " to use the "
        });
        e.createEl("code", { text: "#timeline" });
        e.createSpan({
            text: " tag."
        });
    });

    const timelinesTagSetting = (node: HTMLElement) => {
        const text = new ObsidianTextComponent(node);
        text.setValue(`${calendar.timelineTag ?? ""}`.replace("#", ""))
            .setDisabled(calendar.syncTimelines)
            .onChange(async (v) => {
                calendar.timelineTag = v.replace("#", "");
                await plugin.saveSettings();
            });
        const b = new ExtraButtonComponent(node);
        if (!plugin.canUseTimelines) {
            calendar.syncTimelines = false;
            b.extraSettingsEl.detach();
            return;
        }
        if (calendar.syncTimelines) {
            b.setIcon("checkmark")
                .setTooltip("Unsync from Timelines Plugin")
                .onClick(async () => {
                    calendar.syncTimelines = false;
                    await plugin.saveSettings();
                });
        } else {
            b.setIcon("sync")
                .setTooltip("Sync with Timelines Plugin")
                .onClick(async () => {
                    calendar.syncTimelines = true;
                    calendar.timelineTag =
                        plugin.app.plugins.getPlugin(
                            "obsidian-timelines"
                        ).settings.timelineTag;
                    await plugin.saveSettings();
                });
        }
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
            <ToggleComponent
                name={"Support Timelines Events"}
                desc={timelinesDesc}
                value={timelines}
                on:click={() => {
                    calendar.supportTimelines = !calendar.supportTimelines;
                }}
            />
            {#if timelines}
                {#key calendar.syncTimelines}
                    <TextComponent
                        name={"Default Timelines Tag"}
                        desc={timelinesTagDesc}
                        value={""}
                    >
                        <div
                            use:timelinesTagSetting
                            class="setting-item-control"
                        />
                    </TextComponent>
                {/key}
            {/if}
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
