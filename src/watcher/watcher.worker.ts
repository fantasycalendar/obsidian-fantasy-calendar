import type { CachedMetadata, FrontMatterCache } from "obsidian";
import type { Calendar, CurrentCalendarData, Event } from "src/@types";
import { nanoid, wrap } from "src/utils/functions";
const { DOMParser } = require("xmldom");

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
    event: Event;
    original: Event;
}
export interface DeleteEventMessage {
    type: "delete";
    id: string;
    index: number;
    event: Event;
}

export interface SaveMessage {
    type: "save";
}

export type RenameMessage = {
    type: "rename";
    sourceCalendars: Calendar[];
    file: { path: string; basename: string; oldPath: string };
};

const timelineData: RegExp = /(<(span|div).*?<\/(span|div)>)/g;
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
                        console.info("Received options message");
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
                        console.info("Received calendars message");
                    }
                }
            }
        );

        //Add Files to Queue
        ctx.addEventListener("message", (event: MessageEvent<QueueMessage>) => {
            if (event.data.type == "queue") {
                this.add(...event.data.paths);
                if (this.debug) {
                    console.info(
                        `Received queue message for ${event.data.paths.length} paths`
                    );
                }
            }
        });
    }
    add(...paths: string[]) {
        if (this.debug) {
            console.info(`Adding ${paths.length} paths to queue`);
        }
        this.queue.push(...paths);
        if (!this.parsing) this.parse();
    }
    async parse() {
        this.parsing = true;
        while (this.queue.length) {
            const path = this.queue.shift();
            if (this.debug) {
                console.info(
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
    getDataFromFrontmatter(frontmatter: FrontMatterCache) {
        let name: string, fcCategory: string, eventDisplayName: string;
        if (frontmatter && "fc-ignore" in frontmatter) return {};
        if (frontmatter) {
            name = frontmatter?.["fc-calendar"];
            fcCategory = frontmatter?.["fc-category"];
            eventDisplayName = frontmatter?.["fc-display-name"];
        }
        if (this.addToDefaultIfMissing && (!name || !name.length)) {
            name = this.defaultCalendar;
        }
        name = name?.toLowerCase();
        const calendar = this.calendars.find(
            (calendar) => name == calendar.name.toLowerCase()
        );
        return { calendar, fcCategory, eventDisplayName };
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
        const events = [];
        const { frontmatter } = cache ?? {};

        const { calendar, fcCategory, eventDisplayName } =
            this.getDataFromFrontmatter(frontmatter);

        if (!calendar) {
            if (this.debug) {
                console.info(
                    `Could not find calendar associated with file ${file.basename}`
                );
            }
            this.removeEventsFromFile(file.path);
            return;
        }

        let timelineEvents: Event[] = [];
        if (
            calendar.supportTimelines &&
            allTags &&
            allTags.includes(calendar.timelineTag)
        ) {
            timelineEvents = this.parseTimelineEvents(
                calendar,
                data,
                file,
                fcCategory
            );
            events.push(...timelineEvents);
        }

        const frontmatterEvents = this.parseFrontmatterEvents(
            calendar,
            fcCategory,
            frontmatter,
            file,
            eventDisplayName
        );

        events.push(...frontmatterEvents);
        if (!events || !events.length) {
            this.removeEventsFromFile(file.path);
            return;
        }

        let added = 0;
        for (const event of events) {
            //TODO: Remove event existing check. Old events matching the file should just be removed.
            const existing = calendar.events.find(
                (exist) =>
                    exist.note == file.path &&
                    (!event.timestamp || exist.timestamp == event.timestamp)
            );
            if (
                existing?.date.day == event.date.day &&
                existing?.date.month == event.date.month &&
                existing?.date.year == event.date.year &&
                existing?.end?.day == event.end?.day &&
                existing?.end?.month == event.end?.month &&
                existing?.end?.year == event.end?.year &&
                existing?.category == event.category &&
                existing?.name == event.name &&
                ((!event.timestamp && !existing?.timestamp) ||
                    existing?.timestamp == event.timestamp)
            ) {
                continue;
            }

            ctx.postMessage<UpdateEventMessage>({
                type: "update",
                id: calendar.id,
                index: existing
                    ? calendar.events.findIndex((e) => e.id == existing?.id)
                    : -1,
                event,
                original: existing
            });
            added++;
        }
        if (this.debug && events.length > 0) {
            console.info(
                `${added}/${events.length} (${frontmatterEvents.length} from frontmatter, ${timelineEvents.length} from timelines) event operations completed on ${calendar.name} for ${file.basename}`
            );
        }
    }
    parseFrontmatterEvents(
        calendar: Calendar,
        fcCategory: string,
        frontmatter: FrontMatterCache,
        file: { path: string; basename: string },
        eventDisplayName?: string
    ): Event[] {
        const { date, end } = this.getDates(
            frontmatter,
            this.parseTitle ? file.basename : ""
        );
        if (!date) {
            return [];
        }

        if (date?.month && typeof date?.month == "string") {
            let month = calendar.static.months.find(
                (m) => m.name == (date.month as unknown as string)
            );
            if (!month) {
                date.month = null;
            } else {
                date.month = calendar.static.months.indexOf(month);
            }
        } else if (date?.month && typeof date?.month == "number") {
            date.month = wrap(date.month - 1, calendar.static.months.length);
        }

        if (end?.month && typeof end?.month == "string") {
            let month = calendar.static.months.find(
                (m) => m.name == (end.month as unknown as string)
            );
            if (!month) {
                end.month = null;
            } else {
                end.month = calendar.static.months.indexOf(month);
            }
        } else if (end?.month && typeof end?.month == "number") {
            end.month = wrap(end.month - 1, calendar.static.months.length);
        }

        const timestamp = Number(`${date.year}${date.month}${date.day}00`);

        const category = calendar.categories.find(
            (cat) => cat?.name == fcCategory
        );

        return [
            {
                id: nanoid(6),
                name: eventDisplayName ?? file.basename,
                note: file.path,
                date,
                end,
                category: category?.id,
                description: "",
                auto: true
            }
        ];
    }
    parseTimelineEvents(
        calendar: Calendar,
        contents: string,
        file: { path: string; basename: string },
        fcCategory: string
    ) {
        const events: Event[] = [];
        const domparser = new DOMParser();
        // span or div with attributes:
        // <span
        //     class='ob-timelines'
        //     data-date='144-43-49-00'
        //     data-title='Another Event'
        //     data-class='orange'
        //     data-img = 'Timeline Example/Timeline_2.jpg'
        //     data-type='range'
        //     data-end="2000-10-20-00">
        //     A second event!
        // </span>
        for (const match of contents.matchAll(timelineData)) {
            const doc = domparser.parseFromString(match[0], "text/html");
            const element = {
                class: doc.documentElement.getAttribute("class"),
                dataset: {
                    date: doc.documentElement.getAttribute("data-date"),
                    title: doc.documentElement.getAttribute("data-title"),
                    class: doc.documentElement.getAttribute("data-class"),
                    end: doc.documentElement.getAttribute("data-end")
                },
                content: doc.documentElement.textContent
            };

            if (element.class !== "ob-timelines" || !element.dataset.date) {
                continue; // only look at elements with a date and class='ob-timelines'
            }

            // smash together the yyyy-mm-dd-hh string (accounting for negative years) to use as an id
            const timestamp = Number(
                element.dataset.date[0] == "-"
                    ? +element.dataset.date
                          .substring(1, element.dataset.date.length)
                          .split("-")
                          .join("") * -1
                    : +element.dataset.date.split("-").join("")
            );

            let datebits = element.dataset.date.split(/(?<!^)-/);
            const date = {
                year: parseInt(datebits[0]),
                month: parseInt(datebits[1]),
                day: parseInt(datebits[2])
            };
            let end;
            if (element.dataset.end) {
                datebits = element.dataset.end.split(/(?<!^)-/);
                end = {
                    year: parseInt(datebits[0]),
                    month: parseInt(datebits[1]),
                    day: parseInt(datebits[2])
                };
            }
            const category = calendar.categories.find(
                (cat) => cat?.name == fcCategory
            );

            events.push({
                id: nanoid(6),
                name: element.dataset.title ?? file.basename,
                note: file.path,
                date,
                end,
                timestamp,
                category: category?.id,
                description: element.content,
                auto: true
            });
        }
        return events;
    }
    parseDate(date: string | CurrentCalendarData) {
        if (typeof date === "string") {
            if (!/\d+[./-]\d+[./-]\d+/.test(date)) return;
            try {
                const [match] = date.match(/\d+[./-]\d+[./-]\d+/) ?? [];
                if (!match) return;
                const split = match.split(/[.\-\/]/).map((d) => Number(d));

                const formatter = [
                    ...new Set(
                        this.format
                            .replace(/[^\w]/g, "")
                            .toUpperCase()
                            .split("")
                    )
                ];

                return {
                    year: split[formatter.indexOf("Y")],
                    month: split[formatter.indexOf("M")],
                    day: split[formatter.indexOf("D")]
                };
            } catch (e) {
                return;
            }
        } else {
            return date;
        }
    }
    getDates(frontmatter: Partial<FrontMatterCache> = {}, basename: string) {
        const dateField = "fc-date" in frontmatter ? "fc-date" : "fc-start";
        let startDate: string | CurrentCalendarData;
        if (frontmatter && dateField in frontmatter) {
            startDate = frontmatter[dateField];
        }
        if (!startDate) {
            startDate = basename;
        }

        const date = this.parseDate(startDate);

        const endDate =
            "fc-end" in frontmatter
                ? (frontmatter["fc-end"] as string | CurrentCalendarData)
                : null;
        const end = this.parseDate(endDate);

        return { date, end };
    }
}
new Parser();
