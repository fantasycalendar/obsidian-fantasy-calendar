import { rename } from "fs";
import { Component, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import type { Calendar, CurrentCalendarData } from "src/@types";
import type FantasyCalendar from "src/main";

import Worker, {
    ParseCalendarMessage,
    OutgoingCalendarMessage,
    RenameCalendarMessage,
    GetFileMessage,
    FileCacheMessage
} from "./watcher.worker";

declare global {
    interface Worker {
        postMessage<T>(message: T, transfer?: Transferable[]): void;
    }
}

export class Watcher extends Component {
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

    files: Map<string, Set<Calendar>> = new Map();

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
            if (evt.data.type === "save") {
                this.plugin.saveCalendar();
                return;
            }
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
