import type { Recurring } from "src/settings/settings";
import type Calendar__SvelteComponent_ from "src/view/day/Calendar.svelte";

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
    currentCalendar: string;
    defaultCalendar: string;
    eventPreview: boolean;
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
export interface IntercalaryMonth extends Month {
    length: 1;
    type: "intercalary";
}

interface LeapDayCondition {
    ignore: boolean; //ignore offset
    exclusive: boolean; //causes failure if true
    interval: number; //how many years between checking
}

/**
Example Condition
  
400,!100,4 - Every 4 years, unless it is divisible by 100, but again if it is divisible by 400.

[
    {
        ignore: false,
        exclusive: false,
        interval: 400
    },
    {
        ignore: false,
        exclusive: true,
        interval: 100
    },
    {
        ignore: false,
        exclusive: false,
        interval: 4
    }
]

 */
export interface LeapDay extends Day {
    interval: LeapDayCondition[];
    timespan: number;
    intercalary: boolean;
    offset: number;
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
    faceColor: string;
    shadowColor: string;
    id: string;
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
    category: string;
}

export interface Era {
    name: string;
    format: string;
    description: string;
    start: CurrentCalendarData;
}

export interface ColorEvent extends Event {
    color: string;
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
    leapDays: LeapDay[];
    moons: Moon[];
    eras: Era[];
}

export interface CurrentCalendarData {
    year: number;
    month: number;
    day: number;
}
