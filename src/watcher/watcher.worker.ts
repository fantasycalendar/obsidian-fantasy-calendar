import type { CachedMetadata, FrontMatterCache } from "obsidian";
import type { Calendar, FcEvent, Nullable } from "src/@types";
import { FcEventHelper } from "src/helper/event.helper";

export interface QueueMessage {
    type: "queue";
    paths: string[];
}
export interface OptionsMessage {
    type: "options";
    defaultCalendar: string;
    addToDefaultIfMissing: boolean;
    format: string;
    parseTitle: boolean;
    debug: boolean;
}
export interface CalendarsMessage {
    type: "calendars";
    calendars: Calendar[];
}
export interface FileCacheMessage {
    type: "file";
    path: string;
    file: { path: string; basename: string };
    cache: CachedMetadata;
    allTags: string[];
    data: string;
}
export interface GetFileCacheMessage {
    type: "get";
    path: string;
}
export interface UpdateEventMessage {
    type: "update";
    id: string;
    index: number;
    event: FcEvent;
    original: FcEvent;
}
export interface DeleteEventMessage {
    type: "delete";
    id: string;
    index: number;
    event: FcEvent;
}

export interface SaveMessage {
    type: "save";
}

export type RenameMessage = {
    type: "rename";
    sourceCalendars: Calendar[];
    file: { path: string; basename: string; oldPath: string };
};

const ctx: Worker = self as any;
class Parser {
    queue: string[] = [];
    parsing: boolean = false;
    defaultCalendar: string;
    calendars: Calendar[];
    format: string;
    parseTitle: boolean = false;
    addToDefaultIfMissing: boolean;
    debug: boolean;
    eventHelpers = new Map();

    constructor() {
        //Register Options Changer
        ctx.addEventListener(
            "message",
            (event: MessageEvent<OptionsMessage>) => {
                if (event.data.type == "options") {
                    const {
                        defaultCalendar,
                        addToDefaultIfMissing,
                        format,
                        parseTitle,
                        debug
                    } = event.data;
                    this.addToDefaultIfMissing = addToDefaultIfMissing;
                    this.defaultCalendar = defaultCalendar;
                    this.format = format;
                    this.parseTitle = parseTitle;
                    this.debug = debug;

                    if (this.debug) {
                        console.debug("Received options message");
                    }
                }
            }
        );
        //Register Calendars Changer
        ctx.addEventListener(
            "message",
            (event: MessageEvent<CalendarsMessage>) => {
                if (event.data.type == "calendars") {
                    const { calendars } = event.data;
                    this.calendars = [...calendars];
                    if (this.debug) {
                        console.debug("Received calendars message");
                    }
                }
            }
        );

        //Add Files to Queue
        ctx.addEventListener("message", (event: MessageEvent<QueueMessage>) => {
            if (event.data.type == "queue") {
                this.add(...event.data.paths);
                if (this.debug) {
                    console.debug(
                        `Received queue message for ${event.data.paths.length} paths`
                    );
                }
            }
        });
    }
    add(...paths: string[]) {
        if (this.debug) {
            console.debug(`Adding ${paths.length} paths to queue`);
        }
        this.queue.push(...paths);
        if (!this.parsing) this.parse();
    }
    async parse() {
        this.parsing = true;
        while (this.queue.length) {
            const path = this.queue.shift();
            if (this.debug) {
                console.debug(
                    `Parsing ${path} for calendar events (${this.queue.length} to go)`
                );
            }
            await this.getFileData(path);
        }
        this.parsing = false;
        if (this.debug) {
            console.info(`Parsing complete`);
        }

        ctx.postMessage<SaveMessage>({ type: "save" });
    }
    async getFileData(path: string): Promise<void> {
        let self = this;
        return new Promise((resolve) => {
            function resolution(
                event: MessageEvent<FileCacheMessage | QueueMessage>
            ) {
                if (event.data.type == "queue") {
                    ctx.removeEventListener("message", resolution);
                    resolve();
                    return;
                }
                if (event.data.type != "file") return;
                if (event.data.path != path) return;
                ctx.removeEventListener("message", resolution);
                const { data, cache, allTags, file } = event.data;
                self.parseFileForEvents(data, cache, allTags, file);
                resolve();
            }
            setTimeout(() => resolve(), 500);
            ctx.addEventListener("message", resolution);
            ctx.postMessage<GetFileCacheMessage>({ path, type: "get" });
        });
    }
    removeEventsFromFile(path: string) {
        for (const calendar of this.calendars) {
            for (let i = 0; i < calendar.events.length; i++) {
                const event = calendar.events[i];
                if (!event || !event.note || event.note != path) continue;
                ctx.postMessage<DeleteEventMessage>({
                    event,
                    id: calendar.id,
                    index: i,
                    type: "delete"
                });
            }
        }
    }
    parseFileForEvents(
        data: string,
        cache: CachedMetadata,
        allTags: string[],
        file: { path: string; basename: string }
    ) {
        const { frontmatter } = cache ?? {};

        // Always clear existing events for a changed file
        this.removeEventsFromFile(file.path);

        const eventHelper = this.createEventHandler(frontmatter, file);
        if (!eventHelper) {
            return; // no calendar for this file, events removed
        }

        let fEvents = 0;
        let tEvents = 0;

        eventHelper.parseFrontmatterEvent(frontmatter, file, (event: FcEvent) => {
            ctx.postMessage<UpdateEventMessage>({
                type: "update",
                id: eventHelper.calendar.id,
                index: -1,
                event,
                original: undefined
            });
            fEvents++;
        });

        if (
            eventHelper.calendar.supportTimelines &&
            allTags &&
            allTags.includes(eventHelper.calendar.timelineTag)
        ) {
            eventHelper.parseTimelineEvents(data, file, (event: FcEvent) => {
                ctx.postMessage<UpdateEventMessage>({
                    type: "update",
                    id: eventHelper.calendar.id,
                    index: -1,
                    event,
                    original: undefined
                });
                tEvents++;
            });
        }


        if (this.debug && fEvents + tEvents > 0) {
            console.info(
                `${fEvents} frontmatter and ${tEvents} timeline event operations completed on ${eventHelper.calendar.name} for ${file.basename}`
            );
        }
    }
    createEventHandler(frontmatter: FrontMatterCache, file: { path: string; basename: string }): Nullable<FcEventHelper> {
        if (frontmatter && ! frontmatter["fc-ignore"]) {
            let name = frontmatter?.["fc-calendar"];
            if (this.addToDefaultIfMissing && (!name || !name.length)) {
                name = this.defaultCalendar;
            }
            name = name?.toLowerCase();
            let helper = this.eventHelpers.get(name);
            if (!helper) {
                const calendar = this.calendars.find(
                    (calendar) => name == calendar.name.toLowerCase()
                );
                if (!calendar && this.debug) {
                    console.info(
                        `Could not find calendar associated with file ${file.basename}`
                    );
                    return null;
                }
                helper = new FcEventHelper(calendar, this.parseTitle, this.format);
            }
            return helper;
        }
        return null;
    }
}
new Parser();