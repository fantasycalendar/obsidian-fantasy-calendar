import {
    addIcon,
    ButtonComponent,
    normalizePath,
    Notice,
    PluginSettingTab,
    setIcon,
    Setting,
    TFolder
} from "obsidian";

import copy from "fast-copy";

import { DEFAULT_CALENDAR } from "../main";
import type FantasyCalendar from "../main";
import Importer from "./import/importer";

import CalendarCreator from "./creator/Creator.svelte";

import type { Calendar } from "src/@types";

import { confirmWithModal } from "./modals/confirm";
import { FolderSuggestionModal } from "src/suggester/folder";

export enum Recurring {
    none = "None",
    monthly = "Monthly",
    yearly = "Yearly"
}

declare module "obsidian" {
    interface App {
        internalPlugins: {
            getPluginById(id: "daily-notes"): {
                _loaded: boolean;
                instance: {
                    options: {
                        format: string;
                    };
                };
            };
        };
    }
}

addIcon(
    "fantasy-calendar-grip",
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grip-lines" class="svg-inline--fa fa-grip-lines fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M496 288H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-128H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z"/></svg>`
);

addIcon(
    "fantasy-calendar-warning",
    `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>`
);

export default class FantasyCalendarSettings extends PluginSettingTab {
    contentEl: HTMLDivElement;
    get data() {
        return this.plugin.data;
    }
    constructor(public plugin: FantasyCalendar) {
        super(plugin.app, plugin);
    }
    async display() {
        this.containerEl.empty();
        this.containerEl.createEl("h2", { text: "Fantasy Calendars" });
        this.containerEl.addClass("fantasy-calendar-settings");
        this.contentEl = this.containerEl.createDiv(
            "fantasy-calendar-settings-content"
        );

        this.buildInfo(
            this.contentEl.createDiv("fantasy-calendar-nested-settings")
        );
        this.buildCalendars(
            this.contentEl.createEl("details", {
                cls: "fantasy-calendar-nested-settings",
                attr: {
                    ...(this.data.settingsToggleState.calendars
                        ? { open: `open` }
                        : {})
                }
            })
        );
        this.buildEvents(
            this.contentEl.createEl("details", {
                cls: "fantasy-calendar-nested-settings",
                attr: {
                    ...(this.data.settingsToggleState.events
                        ? { open: `open` }
                        : {})
                }
            })
        );
    }
    buildInfo(containerEl: HTMLElement) {
        containerEl.empty();

        new Setting(containerEl)
            .setName(
                createFragment((e) => {
                    const span = e.createSpan("fantasy-calendar-warning");
                    setIcon(
                        span.createSpan("fantasy-calendar-warning"),
                        "fantasy-calendar-warning"
                    );
                    span.createSpan({ text: "Default Config Directory" });
                })
            )
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Please back up your data before changing this setting. Hidden directories must be manually entered."
                    });
                    e.createEl("br");
                    e.createSpan({
                        text: `Current directory: `
                    });
                    const configDirectory =
                        this.data.configDirectory ?? this.app.vault.configDir;
                    e.createEl("code", {
                        text: configDirectory
                    });
                })
            )
            .addText(async (text) => {
                let folders = this.app.vault
                    .getAllLoadedFiles()
                    .filter((f) => f instanceof TFolder);

                text.setPlaceholder(
                    this.data.configDirectory ?? this.app.vault.configDir
                );
                const modal = new FolderSuggestionModal(this.app, text, [
                    ...(folders as TFolder[])
                ]);

                modal.onClose = async () => {
                    if (!text.inputEl.value) {
                        this.data.configDirectory = null;
                    } else {
                        const exists = await this.app.vault.adapter.exists(
                            text.inputEl.value
                        );

                        if (!exists) {
                            this.data.configDirectory = text.inputEl.value;
                            await this.plugin.saveSettings();
                        }
                    }
                };

                text.inputEl.onblur = async () => {
                    if (!text.inputEl.value) {
                        return;
                    }
                    const exists = await this.app.vault.adapter.exists(
                        text.inputEl.value
                    );

                    this.data.configDirectory = text.inputEl.value;

                    await this.plugin.saveSettings();
                    this.display();
                };
            })
            .addExtraButton((b) => {
                b.setTooltip("Reset to Default")
                    .setIcon("reset")
                    .onClick(async () => {
                        this.data.configDirectory = null;
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });
    }
    buildCalendars(containerEl: HTMLDetailsElement) {
        containerEl.empty();
        containerEl.ontoggle = () => {
            this.data.settingsToggleState.calendars = containerEl.open;
        };
        const summary = containerEl.createEl("summary");
        new Setting(summary).setHeading().setName("Calendar Management");

        summary.createDiv("collapser").createDiv("handle");

        new Setting(containerEl)
            .setName("Default Calendar")
            .setDesc("Views will open to this calendar by default.")
            .addDropdown((d) => {
                d.addOption("none", "None");
                for (let calendar of this.data.calendars) {
                    d.addOption(calendar.id, calendar.name);
                }
                d.setValue(this.plugin.data.defaultCalendar);
                d.onChange((v) => {
                    if (v === "none") {
                        this.plugin.data.defaultCalendar = null;
                        this.plugin.saveSettings();
                        return;
                    }

                    this.plugin.data.defaultCalendar = v;
                    this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName("Import Calendar")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Import calendar from "
                    });
                    e.createEl("a", {
                        href: "https://app.fantasy-calendar.com",
                        text: "Fantasy Calendar",
                        cls: "external-link"
                    });
                })
            )
            .addButton((b) => {
                const input = createEl("input", {
                    attr: {
                        type: "file",
                        name: "merge",
                        accept: ".json",
                        multiple: true,
                        style: "display: none;"
                    }
                });
                input.onchange = async () => {
                    const { files } = input;

                    if (!files.length) return;
                    try {
                        const data = [];
                        for (let file of Array.from(files)) {
                            data.push(JSON.parse(await file.text()));
                        }
                        const calendars = Importer.import(data);
                        this.plugin.data.calendars.push(...calendars);
                        await this.plugin.saveCalendar();
                        this.showCalendars(existing);
                    } catch (e) {
                        new Notice(
                            `There was an error while importing the calendar${
                                files.length == 1 ? "" : "s"
                            }.`
                        );
                        console.error(e);
                    }

                    input.value = null;
                };
                b.setButtonText("Choose Files");
                b.buttonEl.addClass("calendar-file-upload");
                b.buttonEl.appendChild(input);
                b.onClick(() => input.click());
            });

        new Setting(containerEl)
            .setName("Create New Calendar")
            .addButton((button: ButtonComponent) =>
                button
                    .setTooltip("Launch Calendar Creator")
                    .setIcon("plus-with-circle")
                    .onClick(async () => {
                        const calendar = await this.launchCalendarCreator();
                        console.log(
                            "🚀 ~ file: settings.ts ~ line 266 ~ calendar",
                            calendar
                        );

                        /* const modal = new CreateCalendarModal(this.plugin);
                        modal.onClose = async () => {
                            if (!modal.saved) return;
                            const calendar = copy(modal.calendar);
                            if (!calendar.current.year) {
                                calendar.current.year = 1;
                            }
                            await this.plugin.addNewCalendar(calendar);

                            this.showCalendars(existing);
                        };
                        modal.open(); */
                    })
            );

        const existing = containerEl.createDiv("existing-calendars");

        this.showCalendars(existing);
    }
    showCalendars(element: HTMLElement) {
        element.empty();
        if (!this.data.calendars.length) {
            element.createSpan({
                text: "No calendars created! Create a calendar to see it here."
            });
            return;
        }
        for (let calendar of this.data.calendars) {
            new Setting(element)
                .setName(calendar.name)
                .setDesc(calendar.description ?? "")
                .addExtraButton((b) => {
                    b.setIcon("pencil").onClick(() => {
                        this.launchCalendarCreator(calendar);
                    });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash").onClick(async () => {
                        if (
                            !(await confirmWithModal(
                                this.app,
                                "Are you sure you want to delete this calendar?",
                                {
                                    cta: "Delete",
                                    secondary: "Cancel"
                                }
                            ))
                        )
                            return;
                        this.plugin.data.calendars =
                            this.plugin.data.calendars.filter(
                                (c) => c.id != calendar.id
                            );
                        await this.plugin.saveCalendar();

                        if (calendar.name == this.plugin.data.defaultCalendar) {
                            this.display();
                        } else {
                            this.showCalendars(element);
                        }
                    });
                });
        }
    }

    buildEvents(containerEl: HTMLDetailsElement) {
        containerEl.empty();
        containerEl.ontoggle = () => {
            this.data.settingsToggleState.events = containerEl.open;
        };
        const summary = containerEl.createEl("summary");
        new Setting(summary).setHeading().setName("Events");

        summary.createDiv("collapser").createDiv("handle");

        new Setting(containerEl)
            .setName("Display Event Previews")
            .setDesc(
                "Use the core Note Preview plugin to display event notes when hovered."
            )
            .addToggle((t) => {
                t.setValue(this.data.eventPreview).onChange((v) => {
                    this.data.eventPreview = v;
                    this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName("Automatically Parse for Events")
            .setDesc(
                "The plugin will automatically parse files in the vault for events."
            )
            .addToggle((t) => {
                t.setValue(this.data.autoParse).onChange((v) => {
                    this.data.autoParse = v;
                    this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName("Events Folder")
            .setDesc("The plugin will only watch for changes in this folder.")
            .addText((text) => {
                let folders = this.app.vault
                    .getAllLoadedFiles()
                    .filter((f) => f instanceof TFolder);

                text.setPlaceholder(this.plugin.data.path ?? "/");
                const modal = new FolderSuggestionModal(this.app, text, [
                    ...(folders as TFolder[])
                ]);

                modal.onClose = async () => {
                    const v = text.inputEl.value?.trim()
                        ? text.inputEl.value.trim()
                        : "/";
                    this.plugin.data.path = normalizePath(v);
                };

                text.inputEl.onblur = async () => {
                    const v = text.inputEl.value?.trim()
                        ? text.inputEl.value.trim()
                        : "/";
                    this.plugin.data.path = normalizePath(v);
                };
            });
        new Setting(containerEl)
            .setName("Parse Note Titles for Event Dates")
            .setDesc("The plugin will parse note titles for event dates.")
            .addToggle((t) => {
                t.setValue(this.data.parseDates).onChange((v) => {
                    this.data.parseDates = v;
                    this.plugin.saveSettings();
                });
            });
        new Setting(containerEl)
            .setName("Date Format")
            .setClass(this.data.dailyNotes ? "daily-notes" : "no-daily-notes")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Event dates will be parsed using this format."
                    });
                    e.createSpan({ text: "Only the " });
                    e.createEl("code", { text: "Y" });
                    e.createSpan({
                        text: ", "
                    });
                    e.createEl("code", { text: "M" });
                    e.createSpan({
                        text: ", and "
                    });
                    e.createEl("code", { text: "D" });
                    e.createEl("a", {
                        text: "tokens",
                        href: "https://momentjs.com/docs/#/displaying/format/",
                        cls: "external-link"
                    });
                    e.createSpan({
                        text: " are supported."
                    });
                    if (
                        ["Y", "M", "D"].some(
                            (token) => !this.data.dateFormat.includes(token)
                        )
                    ) {
                        e.createEl("br");
                        const span = e.createSpan({
                            cls: "fantasy-calendar-warning date-format"
                        });
                        setIcon(
                            span.createSpan("fantasy-calendar-warning"),
                            "fantasy-calendar-warning"
                        );
                        let missing = ["Y", "M", "D"].filter(
                            (token) => !this.data.dateFormat.includes(token)
                        );
                        span.createSpan({
                            text: ` Date format is missing: ${missing
                                .join(", ")
                                .replace(/, ([^,]*)$/, " and $1")}`
                        });
                    }
                })
            )
            .addText((t) => {
                t.setDisabled(this.data.dailyNotes)
                    .setValue(this.plugin.format)
                    .onChange((v) => {
                        this.data.dateFormat = v;
                        this.plugin.saveSettings();
                    });
                t.inputEl.onblur = () => this.buildEvents(containerEl);
            })
            .addExtraButton((b) => {
                if (!this.plugin.canUseDailyNotes) {
                    b.extraSettingsEl.detach();
                    return;
                }
                if (this.data.dailyNotes) {
                    b.setIcon("checkmark")
                        .setTooltip("Unlink from Daily Notes")
                        .onClick(() => {
                            this.data.dailyNotes = false;
                            this.buildEvents(containerEl);
                        });
                } else {
                    b.setIcon("sync")
                        .setTooltip("Link with Daily Notes")
                        .onClick(() => {
                            this.data.dailyNotes = true;
                            this.buildEvents(containerEl);
                        });
                }
            });

        new Setting(containerEl)
            .setName("Support Timelines Events")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Support <span> elements used by the "
                    });
                    e.createEl("a", {
                        text: "Obsidian Timelines",
                        href: "obsidian://show-plugin?id=obsidian-timelines"
                    });
                    e.createSpan({
                        text: " plugin (by Darakah)."
                    });
                })
            )
            .addToggle((t) => {
                t.setValue(this.data.supportTimelines).onChange((v) => {
                    this.data.supportTimelines = v;
                    this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("Default tag marking pages containing Timelines data")
            .setDesc(
                "Tag to specify which notes to include in created timelines e.g. timeline to use the #timeline tag"
            )
            .addText((text) =>
                text
                    .setPlaceholder(this.data.timelineTag)
                    .setValue(this.data.timelineTag.replace("#", ""))
                    .setDisabled(this.plugin.syncTimelines)
                    .onChange((v) => {
                        this.data.timelineTag = v.startsWith("#") ? v : `#${v}`;
                        this.plugin.saveSettings();
                    })
            )
            .addExtraButton((b) => {
                if (!this.plugin.canUseTimelines) {
                    this.data.syncTimelines = false;
                    b.extraSettingsEl.detach();
                    return;
                }
                if (this.data.syncTimelines) {
                    b.setIcon("checkmark")
                        .setTooltip("Unsync from Timelines Plugin")
                        .onClick(async () => {
                            this.data.syncTimelines = false;
                            await this.plugin.saveSettings();
                            this.buildEvents(containerEl);
                        });
                } else {
                    b.setIcon("sync")
                        .setTooltip("Sync with Timelines Plugin")
                        .onClick(async () => {
                            this.data.syncTimelines = true;
                            this.data.timelineTag =
                                this.plugin.app.plugins.getPlugin(
                                    "obsidian-timelines"
                                ).settings.timelineTag;
                            await this.plugin.saveSettings();
                            this.buildEvents(containerEl);
                        });
                }
            });
    }

    launchCalendarCreator(calendar: Calendar = DEFAULT_CALENDAR) {
        /* this.containerEl.empty(); */
        return new Promise((resolve) => {
            const clone = copy(calendar);
            const $app = new CalendarCreator({
                target: this.containerEl,
                props: {
                    calendar: clone,
                    plugin: this.plugin,
                    width: this.contentEl.clientWidth,
                    top: this.containerEl.offsetTop
                }
            });
            const observer = new ResizeObserver(() => {
                $app.$set({ width: this.contentEl.clientWidth });
            });
            observer.observe(this.contentEl);
            $app.$on(
                "exit",
                (evt: CustomEvent<{ saved: boolean; calendar: Calendar }>) => {
                    this.display();
                    if (evt.detail.saved) {
                        //saved
                        calendar = copy(evt.detail.calendar);
                        observer.disconnect();
                        resolve(calendar);
                    }
                }
            );
            $app.$on("destroy", (evt: CustomEvent<boolean>) => {
                this.display();
                console.log(evt.detail);
                if (evt.detail) {
                    //saved
                    calendar = copy(clone);
                    observer.disconnect();
                    resolve(calendar);
                }
            });
        });
    }
}
