import type { FrontMatterCache } from "obsidian";
import { nanoid, wrap } from "../utils/functions";
const { DOMParser } = require("xmldom");
import type {
    Calendar,
    FcEvent,
    FcEventCategory,
    FcEventDate,
    FcEventSort,
    LeapDay,
    Nullable
} from "../@types";

const timelineData: RegExp = /<(span|div)[\s\S]*?<\/(span|div)>/g;

export type FcEventCallback = (fcEvent: FcEvent) => void;

export interface InputDate {
    year?: any,
    month?: any,
    day?: any,
    order?: any
}

export interface ParseDate {
    year: Nullable<number>,
    month: Nullable<number>,
    day: Nullable<number>,
    order: string
}

export class FcEventHelper {
    calendar: Calendar;
    useFilenameForEvents: boolean;
    formatString: string;
    formatDigest: string;
    padMonth: number;
    padDays: number;

    /**
     * Creates an instance of EventHelper.
     * @param {Calendar} calendar
     */
    constructor(calendar: Calendar, parseTitleForEvents: boolean, dateFormat: string) {
        this.calendar = calendar;
        this.useFilenameForEvents = parseTitleForEvents;
        this.formatString = calendar.dateFormat || dateFormat;
        this.formatDigest = this.formatString.toUpperCase()
            .replace(/[^\w]/g, "")
            .replace(/Y+/g, "Y")
            .replace(/M+/g, "M")
            .replace(/D+/g, "D");
        console.log(this.formatString, this.formatDigest);
        this.padMonth = (calendar.static.months.length + "").length;
        this.padDays = (calendar.static.months.reduce((max, month)=> ( (max > month.length) ? max : month.length), 0) + "").length;
    }

    parseFileForEvents(
        data: string,
        file: { path: string; basename: string },
        frontmatter: FrontMatterCache,
        publish: FcEventCallback
    ) {
        let fcCategory: string;
        console.log("#### parse file for events", frontmatter);
        if (frontmatter) {
            fcCategory = frontmatter?.["fc-category"];
        }
        const category = this.calendar.categories.find(
            (cat) => cat?.name == fcCategory
        );

        // Single event in the frontmatter
        this.parseFrontmatterEvent(
            frontmatter,
            file,
            publish,
            category
        );

        if (this.calendar.supportTimelines) {
            this.parseTimelineEvents(
                data,
                file,
                publish,
                category
            );
        }
    }

    parseFrontmatterEvent(
        frontmatter: FrontMatterCache,
        file: { path: string; basename: string },
        publish: FcEventCallback,
        category?: FcEventCategory
    ) {
        const dateField = "fc-date" in frontmatter ? "fc-date" : "fc-start";
        let date = frontmatter[dateField]
            ? this.parseFrontmatterDate(frontmatter[dateField], file)
            : this.useFilenameForEvents ? this.parseFilenameDate(file) : null;

        let end = frontmatter["fc-end"]
            ? this.parseFrontmatterDate(frontmatter["fc-end"], file)
            : null;

        if (date) {
            publish({
                id: nanoid(6),
                name: frontmatter["fc-display-name"] ?? file.basename,
                description: frontmatter["fc-description"],
                date,
                end,
                sort: this.parsedToTimestamp(date),
                note: file.path,
                category: category?.id,
                img: frontmatter["fc-img"]
            });
        }
    }

    parseTimelineEvents(
        contents: string,
        file: { path: string; basename: string },
        publish: FcEventCallback,
        category?: FcEventCategory
    ) {
        const domparser = new DOMParser();
        // span or div with attributes:
        // <span
        //     data-fc-date='144-Ches'      // mixed/short: year-...
        //     data-fc-end='144-Ches-03-07' // mixed/full:
        //     data-title='Another Event'
        //     data-class='orange'
        //     data-img = 'Timeline Example/Timeline_2.jpg'>
        //     Event description
        // </span>
        // 4 segments: year-\d+-\d+-\d+ or year-monthName-\d+-\d+
        // For repeating events, use *
        for (const match of contents.matchAll(timelineData)) {
            const doc = domparser.parseFromString(match[0], "text/html");
            const element = {
                dataset: {
                    // Fantasy calendar mixed-date format
                    fcDate: doc.documentElement.getAttribute("data-fc-date"),
                    fcEnd: doc.documentElement.getAttribute("data-fc-end"),
                    // timeline card attributes
                    title: doc.documentElement.getAttribute("data-title"),
                    class: doc.documentElement.getAttribute("data-category"),
                    img: doc.documentElement.getAttribute("data-img"),
                },
                content: doc.documentElement.textContent
            };
            if (!element.dataset.fcDate) {
                continue; // span must contain a date
            }
            // parse date strings, will return with all elements present: year, month, day, hour/order
            let date = this.parseFcDateString(element.dataset.fcDate, file);
            let end = element.dataset.fcEnd
                    ? this.parseFcDateString(element.dataset.fcEnd, file)
                    : undefined;

            if (element.dataset.class) {
                let cat = this.calendar.categories.find(
                    (cat) => cat?.name == element.dataset.class
                );
                if (cat) {
                    category = cat;
                }
            }

            if (date) {
                publish({
                    id: nanoid(6),
                    name: element.dataset.title ?? file.basename,
                    description: element.content,
                    date,
                    end,
                    sort: this.parsedToTimestamp(date),
                    note: file.path,
                    category: category?.id,
                    img: element.dataset.img
                });
            }
        }
    }

    parseFilenameDate(file: { path: string; basename: string }): ParseDate {
        // TODO: Filename formatter for this calendar?
        return this.parseFcDateString(file.basename, file);
    }

    parseFrontmatterDate(
        date: string | InputDate,
        file: { path: string; basename: string }
    ): ParseDate {
        if (typeof date === "string") {
            return this.parseFcDateString(date, file);
        }

        // replace any missing segments with '*'
        // to indicate a wildcard/repeating event
        return this.dateFromSegments({
                year: date.year || "*",
                month: date.month || "*",
                day: date.day || "*",
                order: date.order
            },
            file
        );
    }

    /**
     * Date in segments starting with year:
     * - year[-\d+[-\d+[-order]]]
     * - year[-monthName[-\d+[-order]]]
     *
     * Notes:
     * - '*' for repeating segment: year, month, and/or day
     * - order is a simple string to determine the order of events
     *   falling on the same year/month/day
     *
     * @param datestring
     * @param file Source file
     * @returns ParseDate instance
     */
    parseFcDateString(
        datestring: string,
        file: { path: string; basename: string }
    ): ParseDate {
        let datebits = datestring.split(/(?<!^)-/);

        if (this.formatDigest != 'YMD' && datebits.length < 3) {
            logError(`Must specify all three segments in ${this.formatString} order`, null, file, datestring);
            return null;
        }

        return this.dateFromSegments({
                year: datebits[this.formatDigest.indexOf("Y")] || null,
                month: datebits[this.formatDigest.indexOf("M")] || null,
                day: datebits[this.formatDigest.indexOf("D")] || null,
                order: datebits[3] ? datebits[3] : ''
            },
            file,
            datestring
        );
    }

    /**
     * Create a formatted date string for this calendar
     * for the given event date (will not include an order suffix)
     * @returns
     */
    toFcDateString(date: FcEventDate): string {
        return this.formatString
                .replace(/[Yy]+/g, `${date.year}`)
                .replace(/[Mm]{3,}/g, toMonthString(date.month, this.calendar))
                .replace(/[Mm]{2,}/g, toString(date.month + 1, this.padMonth)) // to human index
                .replace(/[Mm]/g, `${date.month + 1}`)
                .replace(/[Dd]{2,}/g, toString(date.day, this.padDays))
                .replace(/[Dd]/g, `${date.day}`);
    }

    /**
     * Create a fully formed date from parsed data segments
     *
     * @param input InputDate, * for repeating, null for omitted
     * @param file Source file
     * @param order Optional extra data to disambiguate or order events with the same date
     * @param datestring Optional/original datestring
     * @returns ParseDate instance
     */
    dateFromSegments(input: InputDate,
            file: { path: string; basename: string },
            datestring?: string
    ): ParseDate {
        const year = wildNullNumber(input.year);
        let month = wildNullNumber(input.month);
        let day = wildNullNumber(input.day);

        if (input.year === "*") {
            // repeating, this is fine
        } else if ( !input.year || Number.isNaN(year)) {
            logError(`Must specify a valid year`, input, file, datestring);
            return null;
        }

        let leapday: LeapDay;
        if (input.month === "*") {
            // repeating, this is fine
        } else if (Number.isInteger(month)) {
            month = wrap(month - 1, this.calendar.static.months.length);
        } else if (Number.isNaN(month)) {
            // Name in the month segment
            let m = this.calendar.static.months.find(
                (m) => m.name.startsWith(input.month)
            );
            if (m) {
                month = this.calendar.static.months.indexOf(m);
            } else {
                // Is this a well-known leapday?
                leapday = this.calendar.static.leapDays.find(
                    (l) => l.name.startsWith(input.month)
                );
                if (leapday) {
                    month = leapday.timespan;
                }
            }
        } else {
            // short form (omitted), assume first month
            month = 0;
        }

        if (input.day === "*") {
            // repeating, this is fine
        } else if ( Number.isInteger(day) ) {
            if ( day < 1 ) {
                logWarning(`Must specify a valid day. Using 1`, input, file, datestring);
                day = 1
            } else if (month) { // validate the day against the month (and perhaps year)
                const days = this.daysForMonth(month, year);
                if (day > days) {
                    logError(`Day '${input.day}' is incorrect for month '${input.month}', which has ${days} day(s)`,
                            input, file, datestring);
                    return null;
                }
            }
        } else if (leapday) {
            // short form (omitted date), but a well-known leapday (e.g. Harptos Shieldmeet)
            day = this.findLeapDay(leapday, month, year);
            if (day == null) {
                logError(`Leap day '${input.day}' isn't valid for year '${input.year}'`, input, file, datestring);
                return null;
            } else if (!year && input.year !== "*") {
                logWarning(`Unable to validate '${input.day}' for year '${input.year}'. Using ${day}`, input, file, datestring);
            }
        } else {
            // short form, assume first day of month
            day = 1;
        }

        return {
            year,
            month,
            day,
            order: input.order || '',
        };
    }

    parsedToTimestamp(date: ParseDate): FcEventSort {
        // put repeating events off to the side
        if (date.year == null || date.month == null || date.day == null) {
            return {
                timestamp: Number.MIN_VALUE,
                order: date.order ? date.order
                    : `${date.year || "*" }-${toString(date.month, this.padMonth)}-${toString(date.day, this.padDays)}`
            }
        }
        // otherwise create a date string
        // TODO: pad month by number of months & days by max days
        return {
            timestamp: Number(`${date.year}${toString(date.month, this.padMonth)}${toString(date.day, this.padDays)}`),
            order: date.order || ''
        };
    }

    timestampForFcEvent(event: Partial<FcEvent>, old?: FcEventSort): FcEventSort {
        if (!old && event.sort) {
            return event.sort;
        }
        // rebuild the timestamp
        return this.parsedToTimestamp({
            ...event.date,
            order: old?.order || ''
        });
    }

    /**
     * Find day in month
     */
    findLeapDay(
        leapday: LeapDay,
        month: number,
        year: number
    ): Nullable<number> {
        const cm = this.calendar.static.months[month];
        const leapdays: LeapDay[] = this.calendar.static.leapDays.filter(
            (l) => l.timespan == month && !l.intercalary || (l.intercalary && l.numbered)
        );
        if (year && !this.testLeapDay(leapday, year)) {
            return null;
        }
        const day = cm.length + leapdays.indexOf(leapday) + 1;
        return day;
    }

    /**
     * Get the number of days in a month
     */
    daysForMonth(month: number, year: Nullable<number>): number {
        const cm = this.calendar.static.months[month];
        const leapdays: LeapDay[] = this.calendar.static.leapDays.filter(
            (l) => l.timespan == month && !l.intercalary || (l.intercalary && l.numbered)
        );

        if (year) {
            let count = leapdays.filter(
                (l) => this.testLeapDay(l, year)
            ).length;
            return cm.length + count;
        }

        // no year, any date in this rage is plausible
        return cm.length + leapdays.length;
    }

    /**
     * Test if a leap day occurs in a given year.
     */
    testLeapDay(leapday: LeapDay, year: number) {
        return leapday.interval
            .sort((a, b) => a.interval - b.interval)
            .some(({ interval, exclusive }, index, array) => {
                if (exclusive && index == 0) {
                    return (year - leapday.offset ?? 0) % interval != 0;
                }

                if (exclusive) return;

                if (array[index + 1] && array[index + 1].exclusive) {
                    return (
                        (year - leapday.offset ?? 0) % interval == 0 &&
                        (year - leapday.offset ?? 0) %
                            array[index + 1].interval !=
                            0
                    );
                }
                return (year - leapday.offset ?? 0) % interval == 0;
            });
    }
}

function toMonthString(month: Nullable<number>, calendar: Calendar): string {
    return month == null
        ? "*"
        : calendar.static.months[month].name;
}

function toString(data: Nullable<number>, padding: number): string {
    return data == null
        ? "*"
        : String(data).padStart(padding, '0');
}

/**
 * Convert a string/null value to null, NaN, or a number.
 * - null or `*` are not a number, but are different than a string
 * - if the value fails to parse as a number, it is a string month name
 * @param data
 * @returns null, a number, or NaN
 */
function wildNullNumber(data: any): Nullable<number> {
    if (data == null || data === "*") {
        return null;
    }
    if (typeof data == "number") {
        return data;
    }
    return parseInt(data); // may return NaN, that's ok
}

function logError(
    message: string,
    input: InputDate,
    file: { path: string; basename: string },
    datestring?: string
) {
    console.log("FC Calendar: %s. From '%s', date value: %o", message, file.path, datestring ? datestring : input);
}

function logWarning(
    message: string,
    input: InputDate,
    file: { path: string; basename: string },
    datestring?: string
) {
    console.log("FC Calendar: %s. From '%s', date value: '%o'", message, file.path, datestring ? datestring : input);
}