import { rename } from "fs";
import {
    Component,
    TAbstractFile,
    TFile,
    TFolder,
    Vault,
    getAllTags
} from "obsidian";
import type { Calendar, Event } from "src/@types";
import type FantasyCalendar from "src/main";
//have to ignore until i fix typing issue
//@ts-expect-error
import Worker, {
    CalendarsMessage,
    GetFileCacheMessage,
    FileCacheMessage,
    OptionsMessage,
    QueueMessage,
    UpdateEventMessage,
    SaveMessage,
    RenameMessage
} from "./watcher.worker";

declare global {
    interface Worker {
        postMessage<T>(message: T, transfer?: Transferable[]): void;
    }
}

export type CalendarEventTree = Map<string, Map<number, Set<number>>>;

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

    tree: CalendarEventTree = new Map();

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
            defaultCalendar: this.plugin.defaultCalendar?.name,
            supportsTimelines: this.plugin.data.supportTimelines,
            timelineTag: this.plugin.data.timelineTag
        });
        this.registerEvent(
            this.plugin.app.workspace.on(
                "fantasy-calendar-settings-change",
                () => {
                    this.worker.postMessage<OptionsMessage>({
                        type: "options",
                        parseTitle: this.plugin.data.parseDates,
                        format: this.plugin.format,
                        defaultCalendar: this.plugin.defaultCalendar?.name,
                        supportsTimelines: this.plugin.data.supportTimelines,
                        timelineTag: this.plugin.data.timelineTag
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
        //TODO: Refactor
        this.registerEvent(
            this.vault.on("rename", (abstractFile, oldPath) => {
                if (!this.calendars.length) return;
                if (!(abstractFile instanceof TFile)) return;
                this.worker.postMessage<RenameMessage>({
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
        //TODO: Refactor
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
                    //TODO: Add in file data parsing for events
                    //TODO: E.g., timelines
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
                    const { id, index, event, original } = evt.data;

                    const calendar = this.calendars.find((c) => c.id == id);
                    if (!calendar) return;
                    console.log(index);
                    calendar.events.splice(index, index >= 0 ? 1 : 0, event);

                    this.addToTree(calendar, event);
                    if (original) {
                        this.addToTree(calendar, original);
                    }
                }
            }
        );

        /** The worker has parsed all files in its queue. */
        this.worker.addEventListener(
            "message",
            async (evt: MessageEvent<SaveMessage>) => {
                if (evt.data.type == "save") {
                    this.plugin.app.workspace.trigger(
                        "fantasy-calendars-event-update",
                        this.tree
                    );
                    console.log(this.tree);
                    this.tree = new Map();
                    await this.plugin.saveCalendar();
                }
            }
        );
        if (!this.calendars.length) return;
        //TODO: Add per-calendar root path.
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;

        const parsing: Set<string> = new Set();
        for (const path of this.getFiles(folder)) parsing.add(path);
        this.startParsing([...parsing]);
    }
    addToTree(calendar: Calendar, event: Event) {
        if (!this.tree.has(calendar.id)) {
            this.tree.set(calendar.id, new Map());
        }
        const calendarTree = this.tree.get(calendar.id);

        if (!calendarTree.has(event.date.year)) {
            calendarTree.set(event.date.year, new Set());
        }

        const yearSet = calendarTree.get(event.date.year);

        this.tree.set(
            calendar.id,
            calendarTree.set(event.date.year, yearSet.add(event.date.month))
        );
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
        const allTags = getAllTags(cache);
        const data = await this.vault.cachedRead(file);
        return {
            cache,
            file: { path: file.path, basename: file.basename },
            allTags,
            data
        };
    }
    getFiles(folder: TAbstractFile): string[] {
        if (!this.plugin.data.autoParse) return [];
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
