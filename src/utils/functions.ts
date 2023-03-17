import type { Calendar, CurrentCalendarData, GenericMonth, LeapDay, Month } from "../@types";

export function daysBetween(date1: Date, date2: Date) {
    const d1 = window.moment(date1);
    const d2 = window.moment(date2);

    let days = d2.diff(d1, "days");

    if (
        (d1.year() < d2.year() || d1.dayOfYear() < d2.dayOfYear()) &&
        (d1.hour() > d2.hour() ||
            d1.minute() > d2.minute() ||
            d1.second() > d2.second() ||
            d1.millisecond() > d2.millisecond())
    ) {
        days += 1;
    }
    return days;
}

export function wrap(value: number, size: number): number {
    return ((value % size) + size) % size;
}

export function nanoid(len: number) {
    return "ID_xyxyxyxyxyxy".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function getIntervalDescription(leapday: LeapDay) {
    if (!leapday.interval?.length) return "";
    const intervals = leapday.interval.sort((a, b) => a.interval - b.interval);
    let description = [];
    for (let interval of intervals) {
        const length = interval.interval;
        const offset =
            leapday.offset && !interval.ignore
                ? ` (offset by ${leapday.offset})`
                : "";
        if (interval.exclusive) {
            if (length == 1) {
                description.push(`not every year${offset}`);
            } else {
                description.push(`not every ${ordinal(length)} year${offset}`);
            }
        } else {
            const index = intervals.indexOf(interval);
            const also = index > 0 && intervals[index - 1].exclusive;
            if (length == 1) {
                description.push(`${also ? "also " : ""}every year${offset}`);
            } else {
                description.push(
                    `${also ? "also " : ""}every ${ordinal(
                        length
                    )} year${offset}`
                );
            }
        }
    }
    const join = description.join(", but ");
    return join[0].toUpperCase() + join.slice(1).toLowerCase();
}

export function ordinal(i: number) {
    const j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
export function dateString(
    date: CurrentCalendarData,
    months: GenericMonth[],
    end?: CurrentCalendarData
) {
    if (!date || date.day == undefined) {
        return "";
    }
    const { day, month, year } = date;
    if (month != undefined && !months[month]) return "Invalid Date";

    if (end && end.day) {
        const endDay = end.day;
        const endMonth = end.month;
        const endYear = end.year;

        if (
            endMonth != undefined &&
            endYear != undefined &&
            month != undefined &&
            year != undefined
        ) {
            if (year != endYear) {
                return `${months[month].name} ${ordinal(day)}, ${year} - ${
                    months[endMonth].name
                } ${ordinal(endDay)}, ${endYear}`;
            }
            if (endMonth == month) {
                return `${months[month].name} ${ordinal(day)}-${ordinal(
                    endDay
                )}, ${year}`;
            }
            if (month != undefined && year != undefined) {
                return `${months[month].name} ${ordinal(day)}-${
                    months[endMonth].name
                } ${ordinal(endDay)}, ${year}`;
            }
            if (month != undefined) {
                return `${months[month].name} ${ordinal(day)}-${
                    months[endMonth].name
                } ${ordinal(endDay)} of every year`;
            }
            return `${ordinal(day)}-${ordinal(endDay)} of every month`;
        }
    }

    if (month != undefined && year != undefined) {
        return `${months[month].name} ${ordinal(day)}, ${year}`;
    }
    if (month != undefined) {
        return `${months[month].name} ${ordinal(day)} of every year`;
    }
    return `${ordinal(day)} of every month`;
}

export function isValidDay(day: number, calendar: Calendar) {
    if (day == null) return false;
    if (calendar?.current?.month == null) return false;
    if (day < 1) return false;
    if (
        day < 1 ||
        day > calendar?.static?.months[calendar.current?.month]?.length ||
        !calendar?.static?.months[calendar.current?.month]?.length
    )
        return false;
    return true;
}

export function isValidMonth(month: number, calendar: Calendar) {
    if (month == null) return false;
    if (!calendar?.static?.months?.length) return false;
    if (month < 0 || month >= calendar?.static?.months?.length) return false;
    return true;
}

export function isValidYear(year: number, calendar: Calendar) {
    if (year == null) return false;
    if (year < 1 && !calendar.static?.useCustomYears) return false;
    if (calendar?.static?.useCustomYears) {
        if (!calendar?.static?.years?.length) return false;
        if (year < 0 || year >= calendar?.static?.years?.length) return false;
    }
    return true;
}

export function areDatesEqual(
    date: CurrentCalendarData,
    date2: CurrentCalendarData
) {
    if (date.day != date2.day) return false;
    if (
        date.month != date2.month &&
        date.month != undefined &&
        date2.month != undefined
    )
        return false;
    if (
        date.year != date2.year &&
        date.year != undefined &&
        date2.year != undefined
    )
        return false;
    return true;
}
