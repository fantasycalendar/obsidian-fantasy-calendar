import { CachedMetadata, FrontMatterCache } from "obsidian";
import { Calendar, CurrentCalendarData, Event } from "src/@types";
import { nanoid, wrap } from "src/utils/functions";

export type ParseCalendarMessage = {
    type: "parse";
    file: { path: string; basename: string };
    cache: CachedMetadata;
    sourceCalendars: Calendar[];
    defaultCalendar: string;
    format: string;
    parseTitle: boolean;
};

export type RenameCalendarMessage = {
    type: "rename";
    sourceCalendars: Calendar[];
    file: { path: string; basename: string; oldPath: string };
};

declare global {
    interface Worker {
        postMessage<T>(message: T, transfer?: Transferable[]): void;
    }
}

const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener(
    "message",
    async (event: MessageEvent<ParseCalendarMessage>) => {
        if (event.data.type === "parse") {
            const {
                file,
                cache,
                sourceCalendars,
                defaultCalendar,
                format,
                parseTitle
            } = event.data;

            let { frontmatter } = cache ?? {};

            let names: string[], fcCategory: string;
            if (frontmatter) {
                names = frontmatter?.["fc-calendar"];
                fcCategory = frontmatter?.["fc-category"];
            }
            if (!names) {
                names = [defaultCalendar];
            }
            if (!Array.isArray(names)) names = [names];

            names = names.map((n) => n.toLowerCase());
            const calendars = sourceCalendars.filter((calendar) =>
                names.includes(calendar.name.toLowerCase())
            );

            const { start: startArray, end: endArray } = getDates(
                frontmatter,
                parseTitle ? file.basename : "",
                format
            );
            if (!startArray.length) return;
            let save = false;
            for (let calendar of calendars) {
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
                    end.month = wrap(
                        end.month - 1,
                        calendar.static.months.length
                    );
                }

                const category = calendar.categories.find(
                    (cat) => cat?.name == fcCategory
                );

                const existing = calendar.events.find(
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
                save = true;
                ctx.postMessage<OutgoingCalendarMessage>({
                    type: "update",
                    id: calendar.id,
                    index: calendar.events.indexOf(existing),
                    event: {
                        id: existing?.id ?? nanoid(6),
                        name: existing?.name ?? file.basename,
                        note: file.path,
                        date,
                        ...(end ? { end } : {}),
                        category: category?.id,
                        description: existing?.description
                    }
                });
            }
            if (save) {
                ctx.postMessage<OutgoingCalendarMessage>({
                    type: "save",
                    id: null,
                    index: null,
                    event: null
                });
            }
        }
    }
);

ctx.addEventListener(
    "message",
    async (event: MessageEvent<RenameCalendarMessage>) => {
        if (event.data.type === "rename") {
            const { sourceCalendars, file } = event.data;

            const oldFileName = file.oldPath
                .split("/")
                .pop()
                .split(".")
                .shift();

            for (let calendar of sourceCalendars) {
                const events = calendar.events.filter(
                    (e) => e.note == file.oldPath || e.note === oldFileName
                );

                for (let event of events) {
                    ctx.postMessage<OutgoingCalendarMessage>({
                        type: "update",
                        id: calendar.id,
                        index: calendar.events.indexOf(event),
                        event: {
                            ...event,
                            note: file.path,
                            name: file.basename
                        }
                    });
                }
            }
            ctx.postMessage<OutgoingCalendarMessage>({
                type: "save",
                id: null,
                index: null,
                event: null
            });
        }
    }
);

export type OutgoingCalendarMessage = {
    type: "save" | "update";
    id: string;
    index: number;
    event: Event;
};

export default {} as typeof Worker & (new () => Worker);

const getDates = (
    frontmatter: Partial<FrontMatterCache> = {},
    basename: string,
    format: string
) => {
    const dateField = "fc-date" in frontmatter ? "fc-date" : "fc-start";
    let dates: string | string[] | CurrentCalendarData | CurrentCalendarData[];
    if (frontmatter && dateField in frontmatter) {
        dates = frontmatter[dateField];
    }
    if (!dates) {
        dates = basename;
    }
    const dateArray: Array<CurrentCalendarData> = [dates]
        .flat(2)
        .map((date) => parseDate(date, format))
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
        .map((date) => parseDate(date, format))
        .filter((d) => d);
    return { start: dateArray, end: endArray };
};

const parseDate = (date: string | CurrentCalendarData, format: string) => {
    if (typeof date === "string") {
        if (!/\d+[./-]\d+[./-]\d+/.test(date)) return;
        try {
            const [match] = date.match(/\d+[./-]\d+[./-]\d+/) ?? [];
            if (!match) return;
            const split = match.split(/[.\-\/]/).map((d) => Number(d));

            const formatter = [
                ...new Set(format.replace(/[^\w]/g, "").toUpperCase().split(""))
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
};
