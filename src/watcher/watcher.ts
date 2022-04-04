import { rename } from "fs";
import {
    Component,
    TAbstractFile,
    TFile,
    TFolder,
    Vault,
    getAllTags,
    FuzzySuggestModal
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
    DeleteEventMessage
} from "./watcher.worker";

declare global {
    interface Worker {
        postMessage<T>(message: T, transfer?: Transferable[]): void;
    }
}

export type CalendarEventTree = Map<string, Set<number>>;

class CalendarPickerModal extends FuzzySuggestModal<Calendar> {
    chosen: Calendar;
    constructor(public plugin: FantasyCalendar) {
        super(plugin.app);
    }
    getItems() {
        return this.plugin.data.calendars;
    }
    getItemText(item: Calendar) {
        return item.name;
    }
    onChooseItem(item: Calendar, evt: MouseEvent | KeyboardEvent): void {
        this.chosen = item;
        this.close();
    }
}

export class Watcher extends Component {
    queue: Set<string> = new Set();
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
        this.plugin.addCommand({
            id: "rescan-events",
            name: "Rescan Events",
            callback: () => {
                if (this.plugin.data.debug) {
                    console.info("Beginning full rescan for calendar events");
                }
                this.start();
            }
        });
        this.plugin.addCommand({
            id: "rescan-events-for-calendar",
            name: "Rescan Events for Calendar",
            callback: () => {
                const modal = new CalendarPickerModal(this.plugin);
                modal.onClose = () => {
                    if (modal.chosen) {
                        if (this.plugin.data.debug) {
                            console.info(
                                "Beginning full rescan for calendar events for calendar " +
                                    modal.chosen.name
                            );
                        }
                        this.start(modal.chosen);
                    }
                };
                modal.open();
            }
        });

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
            addToDefaultIfMissing: this.plugin.data.addToDefaultIfMissing,
            format: this.plugin.format,
            defaultCalendar: this.plugin.defaultCalendar?.name,
            debug: this.plugin.data.debug
        });
        this.registerEvent(
            this.plugin.app.workspace.on(
                "fantasy-calendar-settings-change",
                () => {
                    this.worker.postMessage<OptionsMessage>({
                        type: "options",
                        parseTitle: this.plugin.data.parseDates,
                        addToDefaultIfMissing:
                            this.plugin.data.addToDefaultIfMissing,
                        format: this.plugin.format,
                        defaultCalendar: this.plugin.defaultCalendar?.name
                    });
                }
            )
        );

        /** Metadata for a file has changed and the file should be checked. */
        this.registerEvent(
            this.metadataCache.on("changed", (file) => {
                if (this.queue.has(file.path)) return;
                this.startParsing([file.path]);
            })
        );
        /** A file has been renamed and should be checked for events.
         */
        this.registerEvent(
            this.vault.on("rename", async (abstractFile, oldPath) => {
                if (!this.calendars.length) return;
                if (!(abstractFile instanceof TFile)) return;
                for (const calendar of this.calendars) {
                    calendar.events = calendar.events.filter(
                        (event) => event.note != oldPath
                    );
                }
                this.worker.postMessage<CalendarsMessage>({
                    type: "calendars",
                    calendars: this.calendars
                });
                this.startParsing([abstractFile.path]);
            })
        );
        /** A file has been deleted and should be checked for events to unlink. */
        this.registerEvent(
            this.vault.on("delete", (abstractFile) => {
                if (!(abstractFile instanceof TFile)) return;
                for (let calendar of this.calendars) {
                    const events = calendar.events.filter(
                        (event) => event.note === abstractFile.path
                    );
                    calendar.events = calendar.events.filter(
                        (event) => event.note != abstractFile.path
                    );
                    for (const event of events) {
                        this.addToTree(calendar, event);
                    }
                }
                this.plugin.saveCalendar();
                this.plugin.app.workspace.trigger(
                    "fantasy-calendars-event-update",
                    this.tree
                );
                this.tree = new Map();
            })
        );

        //worker messages
        /** The worker will ask for file information from files in its queue here */
        this.worker.addEventListener(
            "message",
            async (event: MessageEvent<GetFileCacheMessage>) => {
                if (event.data.type == "get") {
                    const { path } = event.data;
                    this.queue.delete(path);
                    const file =
                        this.plugin.app.vault.getAbstractFileByPath(path);
                    if (file instanceof TFile) {
                        const cache = this.metadataCache.getFileCache(file);
                        const allTags = getAllTags(cache);
                        const data = await this.vault.cachedRead(file);
                        this.worker.postMessage<FileCacheMessage>({
                            type: "file",
                            path,
                            cache,
                            file: { path: file.path, basename: file.basename },
                            allTags,
                            data
                        });
                    } else if (file instanceof TFolder) {
                        const paths = file.children.map((f) => f.path);
                        this.startParsing(paths);
                    }
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
                    if (index == -1) {
                        if (this.plugin.data.debug)
                            console.info(
                                `Adding '${event.name}' to ${calendar.name}`
                            );
                        calendar.events.push(event);
                    } else {
                        if (this.plugin.data.debug)
                            console.info(
                                `Updating '${event.name}' in calendar ${calendar.name}`
                            );
                        calendar.events.splice(
                            index,
                            index >= 0 ? 1 : 0,
                            event
                        );
                    }

                    this.addToTree(calendar, event);
                    if (original) {
                        this.addToTree(calendar, original);
                    }
                }
            }
        );

        this.worker.addEventListener(
            "message",
            async (evt: MessageEvent<DeleteEventMessage>) => {
                if (evt.data.type == "delete") {
                    const { id, index, event } = evt.data;
                    if (!event) return;
                    const calendar = this.calendars.find((c) => c.id == id);
                    if (!calendar) return;
                    if (this.plugin.data.debug)
                        console.info(
                            `Removing '${event.name}' from ${calendar.name}`
                        );
                    calendar.events = calendar.events.filter(
                        (e) => e.id != event.id
                    );
                    this.addToTree(calendar, event);
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
                    this.tree = new Map();
                    await this.plugin.saveCalendar();
                }
            }
        );
        this.start();
    }
    start(calendar?: Calendar) {
        const calendars = calendar ? [calendar] : this.calendars;
        if (!calendars.length) return;
        let folders: Set<string> = new Set();

        for (const calendar of calendars) {
            if (!calendar) continue;
            if (!calendar.autoParse) continue;
            const folder = this.vault.getAbstractFileByPath(calendar.path);
            if (!folder || !(folder instanceof TFolder)) continue;
            for (const child of folder.children) {
                folders.add(child.path);
            }
        }

        if (!folders.size) return;
        this.startParsing([...folders]);
    }
    addToTree(calendar: Calendar, event: Event) {
        if (!this.tree.has(calendar.id)) {
            this.tree.set(calendar.id, new Set());
        }
        const calendarTree = this.tree.get(calendar.id);

        if (calendarTree.has(event.date.year)) return;

        calendarTree.add(event.date.year);

        if (event.end && event.end.year != event.date.year) {
            for (let i = event.date.year + 1; i <= event.end.year; i++) {
                calendarTree.add(event.date.year);
            }
        }
    }
    startParsing(paths: string[]) {
        for (const path of paths) {
            this.queue.add(path);
        }
        this.worker.postMessage<QueueMessage>({
            type: "queue",
            paths
        });
    }
    onunload() {
        this.worker.terminate();
        this.worker = null;
    }
}
