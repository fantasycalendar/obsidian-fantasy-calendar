import {
    addIcon,
    ButtonComponent,
    Modal,
    normalizePath,
    Notice,
    Platform,
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

import { confirmDeleteCalendar, confirmWithModal } from "./modals/confirm";
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
    calendarsEl: HTMLDetailsElement;
    existingEl: HTMLDivElement;
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
        this.calendarsEl = this.contentEl.createEl("details", {
            cls: "fantasy-calendar-nested-settings",
            attr: {
                ...(this.data.settingsToggleState.calendars
                    ? { open: `open` }
                    : {})
            }
        });
        this.buildCalendars();
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
            .setName(`Reset "Don't Ask Again" Prompts`)
            .setDesc(
                `All confirmations set to "Don't Ask Again" will be reset.`
            )
            .addButton((b) => {
                b.setIcon("reset").onClick(() => {
                    this.plugin.data.exit = {
                        saving: false,
                        event: false,
                        calendar: false
                    };
                    this.plugin.saveSettings();
                });
            });

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
    buildCalendars() {
        this.calendarsEl.empty();
        this.calendarsEl.ontoggle = () => {
            this.data.settingsToggleState.calendars = this.calendarsEl.open;
        };
        const summary = this.calendarsEl.createEl("summary");
        new Setting(summary).setHeading().setName("Calendar Management");

        summary.createDiv("collapser").createDiv("handle");

        new Setting(this.calendarsEl)
            .setName("Default Calendar")
            .setDesc("Views will open to this calendar by default.")
            .addDropdown((d) => {
                d.addOption("none", "None");
                for (let calendar of this.data.calendars) {
                    d.addOption(calendar.id, calendar.name);
                }
                d.setValue(this.plugin.data.defaultCalendar);
                d.onChange(async (v) => {
                    if (v === "none") {
                        this.plugin.data.defaultCalendar = null;
                        this.plugin.saveSettings();
                        return;
                    }

                    this.plugin.data.defaultCalendar = v;
                    await this.plugin.saveSettings();
                    this.plugin.watcher.start();
                });
            });
        new Setting(this.calendarsEl)
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
                        for (const calendar of calendars) {
                            await this.plugin.addNewCalendar(calendar);
                        }
                        this.display();
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

        new Setting(this.calendarsEl)
            .setName("Create New Calendar")
            .addButton((button: ButtonComponent) =>
                button
                    .setTooltip("Launch Calendar Creator")
                    .setIcon("plus-with-circle")
                    .onClick(async () => {
                        const calendar = await this.launchCalendarCreator();
                        if (calendar) {
                            await this.plugin.addNewCalendar(calendar);
                            this.display();
                        }
                    })
            );

        this.existingEl = this.calendarsEl.createDiv("existing-calendars");

        this.showCalendars();
    }
    showCalendars() {
        this.existingEl.empty();
        if (!this.data.calendars.length) {
            this.existingEl.createSpan({
                text: "No calendars created! Create a calendar to see it here."
            });
            return;
        }
        for (let calendar of this.data.calendars) {
            new Setting(this.existingEl)
                .setName(calendar.name)
                .setDesc(calendar.description ?? "")
                .addExtraButton((b) => {
                    b.setIcon("pencil").onClick(async () => {
                        const edited = await this.launchCalendarCreator(
                            calendar
                        );
                        if (edited) {
                            this.plugin.addNewCalendar(edited, calendar);
                            await this.plugin.saveCalendar();
                            this.display();
                        }
                    });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash").onClick(async () => {
                        if (
                            !this.plugin.data.exit.calendar &&
                            !(await confirmDeleteCalendar(this.plugin))
                        )
                            return;

                        this.plugin.data.calendars =
                            this.plugin.data.calendars.filter(
                                (c) => c.id != calendar.id
                            );
                        if (calendar.id == this.data.defaultCalendar) {
                            this.plugin.data.defaultCalendar =
                                this.plugin.data.calendars[0]?.id;
                            this.plugin.watcher.start();
                        }
                        await this.plugin.saveCalendar();

                        this.display();
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
            .setName("Add Events to Default Calendar")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Add events found in notes to the default calendar if the "
                    });
                    e.createEl("code", { text: "fc-calendar" });
                    e.createSpan({ text: " frontmatter tag is not present." });
                })
            )
            .addToggle((t) => {
                t.setValue(this.data.addToDefaultIfMissing).onChange(
                    async (v) => {
                        this.data.addToDefaultIfMissing = v;
                        await this.plugin.saveSettings();
                        this.plugin.watcher.start();
                    }
                );
            });
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
            .setName("Parse Note Titles for Event Dates")
            .setDesc("The plugin will parse note titles for event dates.")
            .addToggle((t) => {
                t.setValue(this.data.parseDates).onChange(async (v) => {
                    this.data.parseDates = v;
                    await this.plugin.saveSettings();
                    this.plugin.watcher.start();
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

    launchCalendarCreator(
        calendar: Calendar = DEFAULT_CALENDAR
    ): Promise<Calendar | void> {
        /* this.containerEl.empty(); */
        const clone = copy(calendar);

        if (Platform.isMobile) {
            const modal = new MobileCreatorModal(this.plugin, clone);
            return new Promise((resolve, reject) => {
                try {
                    modal.onClose = () => {
                        if (modal.saved) {
                            calendar = copy(modal.calendar);
                            resolve(calendar);
                        }
                        resolve();
                    };

                    modal.open();
                } catch (e) {
                    reject();
                }
            });
        } else {
            this.containerEl.addClass("fantasy-calendar-creator-open");
            return new Promise((resolve) => {
                const color = getComputedStyle(
                    this.containerEl
                ).backgroundColor;
                const $app = new CalendarCreator({
                    target: this.containerEl,
                    props: {
                        calendar: clone,
                        plugin: this.plugin,
                        width: this.contentEl.clientWidth,
                        color,
                        top: this.containerEl.scrollTop
                    }
                });
                const observer = new ResizeObserver(() => {
                    $app.$set({ width: this.contentEl.clientWidth });
                });
                observer.observe(this.contentEl);
                $app.$on(
                    "exit",
                    (
                        evt: CustomEvent<{ saved: boolean; calendar: Calendar }>
                    ) => {
                        this.containerEl.removeClass(
                            "fantasy-calendar-creator-open"
                        );
                        $app.$destroy();
                        if (evt.detail.saved) {
                            //saved
                            calendar = copy(evt.detail.calendar);
                            observer.disconnect();
                            resolve(calendar);
                        }
                        resolve();
                    }
                );
            });
        }
    }
}

class MobileCreatorModal extends Modal {
    calendar: Calendar;
    saved = false;
    constructor(public plugin: FantasyCalendar, calendar: Calendar) {
        super(plugin.app);
        this.calendar = copy(calendar);
    }
    onOpen() {
        this.contentEl.setAttr(
            "style",
            "background-color: inherit; padding-top: 0px;"
        );
        const $app = new CalendarCreator({
            target: this.contentEl,
            props: {
                calendar: this.calendar,
                plugin: this.plugin,
                width: this.contentEl.clientWidth,
                top: 0
            }
        });
        $app.$on(
            "exit",
            (
                evt: CustomEvent<{
                    saved: boolean;
                    calendar: Calendar;
                }>
            ) => {
                if (evt.detail.saved) {
                    //saved
                    this.calendar = copy(evt.detail.calendar);
                    this.saved = true;
                }
                this.close();
                $app.$destroy();
            }
        );
    }
}
