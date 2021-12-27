import { rename } from "fs";
import { Component, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import type { Calendar, CurrentCalendarData } from "src/@types";
import type FantasyCalendar from "src/main";
import Worker, {
    CalendarsMessage,
    GetFileCacheMessage,
    FileCacheMessage,
    OptionsMessage,
    QueueMessage,
    UpdateEventMessage,
    SaveMessage
} from "./watcher.worker";

import type {
    ParseCalendarMessage,
    OutgoingCalendarMessage,
    RenameCalendarMessage,
    GetFileMessage
} from "./watcher.worker.old";

declare global {
    interface Worker {
        postMessage<T>(message: T, transfer?: Transferable[]): void;
    }
}

export class Watcher extends Component {
    parsing: Set<string> = new Set();
    get calendars() {
        return this.plugin.data.calendars;
    }
    get metadataCache() {
        return this.plugin.app.metadataCache;
    }
    get vault() {
        return this.plugin.app.vault;
    }
    constructor(public plugin: FantasyCalendar) {
        super();
    }
    worker = new Worker();
    onload() {
        /** Send the worker the calendars so I don't have to with every message. */
        this.worker.postMessage<CalendarsMessage>({
            type: "calendars",
            calendars: this.calendars
        });
        this.registerEvent(
            this.plugin.app.workspace.on("fantasy-calendars-updated", () => {
                this.worker.postMessage<CalendarsMessage>({
                    type: "calendars",
                    calendars: this.calendars
                });
            })
        );
        /** Send the workers the options so I don't have to with every message. */
        this.worker.postMessage<OptionsMessage>({
            type: "options",
            parseTitle: this.plugin.data.parseDates,
            format: this.plugin.format,
            defaultCalendar: this.plugin.defaultCalendar?.name
        });
        this.registerEvent(
            this.plugin.app.workspace.on(
                "fantasy-calendar-settings-change",
                () => {
                    this.worker.postMessage<OptionsMessage>({
                        type: "options",
                        parseTitle: this.plugin.data.parseDates,
                        format: this.plugin.format,
                        defaultCalendar: this.plugin.defaultCalendar?.name
                    });
                }
            )
        );

        /** Metadata for a file has changed and the file should be checked. */
        this.registerEvent(
            this.metadataCache.on("changed", (file) => {
                const parsing: Set<string> = new Set();
                for (const path of this.getFiles(file)) parsing.add(path);
                this.startParsing([...parsing]);
            })
        );
        /** A file has been renamed and should be checked for events.
         * Could this be hashed?
         */
        this.registerEvent(
            this.vault.on("rename", (abstractFile, oldPath) => {
                if (!this.calendars.length) return;
                if (!(abstractFile instanceof TFile)) return;
                this.worker.postMessage<RenameCalendarMessage>({
                    type: "rename",
                    file: {
                        path: abstractFile.path,
                        basename: abstractFile.basename,
                        oldPath
                    },
                    sourceCalendars: this.calendars
                });
            })
        );
        /** A file has been deleted and should be checked for events to unlink. */
        this.registerEvent(
            this.vault.on("delete", (abstractFile) => {
                if (!(abstractFile instanceof TFile)) return;

                for (let calendar of this.calendars) {
                    for (let event of calendar.events) {
                        if (!event.note) continue;
                        if (event.note === abstractFile.path) {
                            event.note = null;
                        }
                    }
                }
                this.plugin.saveCalendar();
            })
        );

        //worker messages
        /** The worker will ask for file information from files in its queue here */
        this.worker.addEventListener(
            "message",
            async (event: MessageEvent<GetFileCacheMessage>) => {
                if (event.data.type == "get") {
                    const { path } = event.data;
                    const data = await this.getFileInformation(path);
                    this.worker.postMessage<FileCacheMessage>({
                        type: "file",
                        path,
                        ...data
                    });
                }
            }
        );

        /** The worker has found an event that should be updated. */
        this.worker.addEventListener(
            "message",
            async (evt: MessageEvent<UpdateEventMessage>) => {
                if (evt.data.type == "update") {
                    const { id, index, event } = evt.data;

                    const calendar = this.calendars.find((c) => c.id == id);
                    if (!calendar) return;

                    calendar.events.splice(index, index >= 0 ? 1 : 0, event);
                    //should fire (fantasy-calendar-event-update) here to update CalendarHelper hash
                }
            }
        );

        /** The worker has parsed all files in its queue. */
        this.worker.addEventListener(
            "message",
            async (evt: MessageEvent<SaveMessage>) => {
                if (evt.data.type == "save") {
                    await this.plugin.saveCalendar();
                }
            }
        );
        if (!this.calendars.length) return;
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;

        const parsing: Set<string> = new Set();
        for (const path of this.getFiles(folder)) parsing.add(path);
        this.startParsing([...parsing]);
    }
    startParsing(paths: string[]) {
        if (paths.length) {
            this.worker.postMessage<QueueMessage>({
                type: "queue",
                paths
            });
        }
    }
    async getFileInformation(path: string) {
        const file = this.plugin.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) return;

        const cache = this.metadataCache.getFileCache(file);
        const data = await this.vault.cachedRead(file);
        return {
            cache,
            file: { path: file.path, basename: file.basename },
            data
        };
    }
    getFiles(folder: TAbstractFile): string[] {
        let files = [];
        if (folder instanceof TFolder) {
            for (const child of folder.children) {
                files.push(...this.getFiles(child));
            }
        }
        if (folder instanceof TFile) {
            files.push(folder.path);
        }
        return files;
    }
    
    onunload() {
        this.worker.terminate();
        this.worker = null;
    }
}

export class OldWatcher extends Component {
    get calendars() {
        return this.plugin.data.calendars;
    }
    get vault() {
        return this.plugin.app.vault;
    }
    get metadataCache() {
        return this.plugin.app.metadataCache;
    }

    constructor(public plugin: FantasyCalendar) {
        super();
    }

    worker = new Worker();

    onload() {
        this.recurseFiles();

        this.registerEvent(
            this.metadataCache.on("changed", (file) => {
                this.parsing.push(...this.getFiles(file));
            })
        );
        this.registerEvent(
            this.vault.on("rename", (abstractFile, oldPath) => {
                if (!this.calendars.length) return;
                if (!(abstractFile instanceof TFile)) return;
                this.worker.postMessage<RenameCalendarMessage>({
                    type: "rename",
                    file: {
                        path: abstractFile.path,
                        basename: abstractFile.basename,
                        oldPath
                    },
                    sourceCalendars: this.calendars
                });
            })
        );
        this.registerEvent(
            this.vault.on("delete", (abstractFile) => {
                if (!(abstractFile instanceof TFile)) return;

                for (let calendar of this.calendars) {
                    for (let event of calendar.events) {
                        if (!event.note) continue;
                        if (event.note === abstractFile.path) {
                            event.note = null;
                        }
                    }
                }
                this.plugin.saveCalendar();
            })
        );
        this.worker.onmessage = async (
            evt: MessageEvent<OutgoingCalendarMessage>
        ) => {
            /* if (evt.data.type === "save") {
                this.plugin.saveCalendar();
                return;
            } */
            const { id, index, event } = evt.data;

            const calendar = this.calendars.find((c) => c.id == id);

            calendar.events.splice(index, index >= 0 ? 1 : 0, event);
        };

        /**
         * The watcher will send this message to get details of a file path.
         */
        this.worker.addEventListener(
            "message",
            (evt: MessageEvent<GetFileMessage>) => {
                if (evt.data.type == "file") {
                    this.parseFileForEvents(evt.data.path);
                }
            }
        );
    }
    recurseFiles() {
        if (!this.calendars.length) return;
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;

        this.parsing = this.getFiles(folder);
        this.startParsing();

        /* this.recurseFolder(folder); */
    }
    startParsing(calendar?: Calendar) {
        if (this.parsing.length) {
            this.worker.postMessage({ type: "start", parsing: this.parsing });
        }
    }

    getFile(path: string) {
        const file = this.plugin.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) return;

        const cache = this.metadataCache.getFileCache(file);
        return { cache, file };
    }
    registerCalendar(calendar: Calendar) {
        console.log("[Fantasy Calendar] Parsing files for events.");
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;
        /* this.recurseFolder(folder, calendar); */
        this.parsing = this.getFiles(folder);
        console.log("[Fantasy Calendar] Parsing complete.");
    }
    parsing: string[];
    getFiles(folder: TAbstractFile): string[] {
        let files = [];
        if (folder instanceof TFolder) {
            for (const child of folder.children) {
                files.push(...this.getFiles(child));
            }
        }
        if (folder instanceof TFile) {
            return [folder.path];
        }
        return files;
    }
    /* recurseFolder(folder: TFolder, calendar?: Calendar) {
        Vault.recurseChildren(folder, (abstractFile) => {
            if (!abstractFile) return;

            if (abstractFile instanceof TFile) {
                requestAnimationFrame(() =>
                    this.parseFileForEvents(abstractFile, calendar)
                );
            }
        });
    } */
    testPath(filePath: string) {
        return (
            `/${filePath}`.match(new RegExp(`^${this.plugin.data.path}`)) !=
            null
        );
    }

    parseFileForEvents(path: string, calendar?: Calendar) {
        if (!this.calendars.length) return;
        //if the file is not in a calendar watch path, return;
        if (!this.testPath(path)) return;
        const file = this.plugin.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) return;
        const cache = this.metadataCache.getFileCache(file);

        this.worker.postMessage<ParseCalendarMessage>({
            type: "parse",
            file: { path: file.path, basename: file.basename },
            cache,
            sourceCalendars: calendar ? [calendar] : this.calendars,
            defaultCalendar: this.plugin.defaultCalendar.name,
            format: this.plugin.format,
            parseTitle: this.plugin.data.parseDates
        });
    }
    onunload() {
        this.worker.terminate();
        this.worker = null;
    }
}
