import type { CurrentCalendarData, Event, Month } from "../@types";

export function nanoid(len: number) {
    return "ID_xyxyxyxyxyxy".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function ordinal(i: number) {
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
