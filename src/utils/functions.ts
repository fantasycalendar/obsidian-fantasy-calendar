import type { CurrentCalendarData, LeapDay, Month } from "../@types";

export function daysBetween(date1: Date, date2: Date) {
    return Math.floor(
        (date1.valueOf() - new Date(date2).valueOf()) / 1000 / 60 / 60 / 24
    );
    
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
        const length =
            interval.interval + (interval.ignore ? 0 : leapday.offset);
        if (interval.exclusive) {
            description.push(`not every ${ordinal(length)} year`);
        } else {
            const index = intervals.indexOf(interval);
            const also = index > 0 && intervals[index - 1].exclusive;
            description.push(
                `${also ? "also " : ""}every ${ordinal(length)} year`
            );
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
export function dateString(date: CurrentCalendarData, months: Month[]) {
    if (!date || date.day == undefined) {
        return "";
    }
    const { day, month, year } = date;

    if (!months[month]) return "Invalid Date";

    if (month != undefined && year != undefined) {
        return `${months[month].name} ${ordinal(day)}, ${year}`;
    }
    if (month != undefined) {
        return `${months[month].name} ${ordinal(day)} of every year`;
    }
    return `${ordinal(day)} of every month`;
}
function LeapDay(leapday: any, LeapDay: any) {
    throw new Error("Function not implemented.");
}
