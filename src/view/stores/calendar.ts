import { Calendar } from "src/@types";
import CalendarHelper from "src/helper";
import FantasyCalendar from "src/main";
import { writable } from "svelte/store";

export function createCalendarStore(
    calendar: Calendar,
    plugin: FantasyCalendar
) {
    const store = writable(calendar);
    const { subscribe, set, update } = store;

    const dayView = writable(false);

    return {
        subscribe,
        set,
        update,
        dayView
    };
}
