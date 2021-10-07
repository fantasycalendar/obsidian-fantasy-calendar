import type { Event, Month } from "../@types";

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
export function dateString(event: Event, months: Month[]) {
    if (!event.date || event.date.day == undefined) {
        return "";
    }
    const { day, month, year } = event.date;
    if (month != undefined && year != undefined) {
        return `${months[month].name} ${ordinal(day)}, ${year}`;
    }
    if (month != undefined) {
        return `${months[month].name} ${ordinal(day)} of every year`;
    }
    return `${ordinal(day)} of every month`;
}
