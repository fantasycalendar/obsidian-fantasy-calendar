import { CachedMetadata, FrontMatterCache } from "obsidian";
import { Calendar, CurrentCalendarData, Event } from "src/@types";
import { nanoid, wrap } from "src/utils/functions";

export interface QueueMessage {
    type: "queue";
    paths: string[];
}
export interface OptionsMessage {
    type: "options";
    defaultCalendar: string;
    format: string;
    parseTitle: boolean;
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
    constructor() {
        //Register Options Changer
        ctx.addEventListener(
            "message",
            (event: MessageEvent<OptionsMessage>) => {
                if (event.data.type == "options") {
                    const { defaultCalendar, format, parseTitle } = event.data;
                    this.defaultCalendar = defaultCalendar;
                    this.format = format;
                    this.parseTitle = parseTitle;
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
                }
            }
        );

        //Add Files to Queue
        ctx.addEventListener("message", (event: MessageEvent<QueueMessage>) => {
            if (event.data.type == "queue") {
                this.add(...event.data.paths);
            }
        });
    }
    add(...paths: string[]) {
        this.queue.push(...paths);
        if (!this.parsing) this.parse();
    }
    async parse() {
        this.parsing = true;
        while (this.queue.length) {
            const path = this.queue.shift();
            const { data, file, cache } = await this.getFileData(path);
            this.parseFileForEvents(cache, file);
        }
        this.parsing = false;
        ctx.postMessage<SaveMessage>({ type: "save" });
    }
    async getFileData(path: string): Promise<FileCacheMessage> {
        return new Promise((resolve) => {
            ctx.addEventListener(
                "message",
                (event: MessageEvent<FileCacheMessage>) => {
                    resolve(event.data);
                }
            );
            ctx.postMessage<GetFileCacheMessage>({ path, type: "get" });
        });
    }
    parseFileForEvents(
        cache: CachedMetadata,
        file: { path: string; basename: string }
    ) {
        let { frontmatter } = cache ?? {};

        let names: string[], fcCategory: string;
        if (frontmatter) {
            names = frontmatter?.["fc-calendar"];
            fcCategory = frontmatter?.["fc-category"];
        }
        if (!names) {
            names = [this.defaultCalendar];
        }
        if (!Array.isArray(names)) names = [names];

        names = names.map((n) => n.toLowerCase());
        const calendars = this.calendars.filter((calendar) =>
            names.includes(calendar.name.toLowerCase())
        );

        const { start: startArray, end: endArray } = this.getDates(
            frontmatter,
            this.parseTitle ? file.basename : ""
        );
        if (!startArray.length) return;
        let save = false;
        for (let calendar of calendars) {
            if (!calendar) continue;
            let index = names.indexOf(calendar.name.toLowerCase());

            /** Clamp index to length of dates provided. */
            if (index >= startArray.length || index == -1) {
                index = startArray.length - 1;
            }
            let date = (startArray[index] as CurrentCalendarData) ?? {
                day: null,
                month: null,
                year: null
            };

            let end: CurrentCalendarData = endArray.length
                ? endArray[index] ?? endArray[endArray.length - 1]
                : null;

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
                date.month = wrap(
                    date.month - 1,
                    calendar.static.months.length
                );
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

            const category = calendar.categories.find(
                (cat) => cat?.name == fcCategory
            );

            const existing = calendar?.events.find(
                (event) => event.note == file.path
            );

            if (
                existing?.date.day == date.day &&
                existing?.date.month == date.month &&
                existing?.date.year == date.year &&
                existing?.end?.day == end?.day &&
                existing?.end?.month == end?.month &&
                existing?.end?.year == end?.year &&
                existing?.category == category?.id
            ) {
                continue;
            }
            ctx.postMessage<UpdateEventMessage>({
                type: "update",
                id: calendar.id,
                index: calendar?.events.indexOf(existing),
                event: {
                    id: existing?.id ?? nanoid(6),
                    name: existing?.name ?? file.basename,
                    note: file.path,
                    date,
                    ...(end ? { end } : {}),
                    category: category?.id,
                    description: existing?.description
                },
                original: existing
            });
        }
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
        let dates:
            | string
            | string[]
            | CurrentCalendarData
            | CurrentCalendarData[];
        if (frontmatter && dateField in frontmatter) {
            dates = frontmatter[dateField];
        }
        if (!dates) {
            dates = basename;
        }
        const dateArray: Array<CurrentCalendarData> = [dates]
            .flat(2)
            .map((date) => this.parseDate(date))
            .filter((d) => d);
        const ends =
            "fc-end" in frontmatter
                ? (frontmatter["fc-end"] as
                      | string
                      | string[]
                      | CurrentCalendarData
                      | CurrentCalendarData[])
                : [];
        const endArray: Array<CurrentCalendarData> = [ends]
            .flat(2)
            .map((date) => this.parseDate(date))
            .filter((d) => d);
        return { start: dateArray, end: endArray };
    }
}

export default {} as typeof Worker & (new () => Worker);

const parser = new Parser();
