import { rename } from "fs";
import { Component, TFile, TFolder, Vault } from "obsidian";
import type { Calendar, CurrentCalendarData } from "src/@types";
import type FantasyCalendar from "src/main";

import Worker, {
    ParseCalendarMessage,
    OutgoingCalendarMessage,
    RenameCalendarMessage
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
                this.parseFileForEvents(file);
            })
        );
        this.registerEvent(
            this.vault.on("rename", (abstractFile, oldPath) => {
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
    }
    recurseFiles() {
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;
        this.recurseFolder(folder);
        this.plugin.saveCalendar();
    }
    registerCalendar(calendar: Calendar) {
        console.log("[Fantasy Calendar] Parsing files for events.");
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;
        this.recurseFolder(folder, calendar);
        console.log("[Fantasy Calendar] Parsing complete.");
    }
    recurseFolder(folder: TFolder, calendar?: Calendar) {
        Vault.recurseChildren(folder, (abstractFile) => {
            if (!abstractFile) return;

            if (abstractFile instanceof TFile) {
                this.parseFileForEvents(abstractFile, calendar);
            }
        });
    }
    testPath(filePath: string) {
        return (
            `/${filePath}`.match(new RegExp(`^${this.plugin.data.path}`)) !=
            null
        );
    }

    parseFileForEvents(file: TFile, calendar?: Calendar) {
        //if the file is not in a calendar watch path, return;
        if (!this.testPath(file.path)) return;

        const cache = this.metadataCache.getFileCache(file);
        if (!cache) return;

        this.worker.postMessage<ParseCalendarMessage>({
            type: "parse",
            file: { path: file.path, basename: file.basename },
            cache,
            sourceCalendars: calendar ? [calendar] : this.calendars
        });
    }
    onunload() {
        this.worker.terminate();
        this.worker = null;
    }
}
