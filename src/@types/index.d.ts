import type { Recurring } from "src/settings/settings";
import type Calendar__SvelteComponent_ from "src/view/ui/Calendar.svelte";

export interface Calendar {
    id: string;
    name: string;
    description: string;
    static: StaticCalendarData;
    current: CurrentCalendarData;
    events: Event[];
    categories: EventCategory[];
}

export interface FantasyCalendarData {
    calendars: Calendar[];
    currentCalendar: Calendar;
    defaultCalendar: Calendar;
}

export interface TimeSpan {
    type: string;
    name: string;
    id: string;
}

export interface Day extends TimeSpan {}
export type Week = Day[];
export interface Month extends TimeSpan {
    length: number;
}

export interface LeapDay extends Day {
    interval: number;
    after: number;
    month: Month;
}

export interface Season {
    name: string;
    start: {
        month: Month;
        day: Day;
    };
}
export interface Moon {
    name: string;
    cycle: number;
    offset: number;
    face: string;
    shadow: string;
}

export interface Event {
    name: string;
    description: string;
    date: {
        month: number;
        day: number;
        year: number;
    };
    id: string;
    note: string;
    category?: string;
    /* recurring: keyof typeof Recurring; */
}

export interface EventCategory {
    name: string;
    color: string;
    id: string;
}

export interface StaticCalendarData {
    firstWeekDay: number;
    overflow: boolean;
    weekdays: Week;
    months: Month[];
    /*     leapDays: LeapDay[];
    moons: Moon[];
    seasons: Season[]; */
}

export interface CurrentCalendarData {
    year: number;
    month: number;
    day: number;
}
