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
    date?: number;
    displayWeeks?: boolean;
    autoParse?: boolean;
    path?: boolean;
}

export interface FantasyCalendarData {
    calendars: Calendar[];
    currentCalendar: string;
    defaultCalendar: string;
    eventPreview: boolean;
    configDirectory: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    parseDates: boolean;
    dateFormat: string;
    dailyNotes: boolean;
    path: string;
    supportTimelines: boolean;
    timelineTag: string;
    syncTimelines: boolean;
    autoParse: boolean;
    settingsToggleState: {
        calendars: boolean;
        events: boolean;
    };
}

export interface TimeSpan {
    type: string;
    name: string;
    id: string;
}

export interface Day extends TimeSpan {}
export interface Year extends TimeSpan {}
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
export type Phase =
    | "New Moon"
    | "New Moon Fading"
    | "New Moon Faded"
    | "Waxing Crescent Rising"
    | "Waxing Crescent Risen"
    | "Waxing Crescent"
    | "Waxing Crescent Fading"
    | "Waxing Crescent Faded"
    | "First Quarter Rising"
    | "First Quarter Risen"
    | "First Quarter"
    | "First Quarter Fading"
    | "First Quarter Faded"
    | "Waxing Gibbous Rising"
    | "Waxing Gibbous Risen"
    | "Waxing Gibbous"
    | "Waxing Gibbous Fading"
    | "Waxing Gibbous Faded"
    | "Full Moon Rising"
    | "Full Moon Risen"
    | "Full Moon"
    | "Full Moon Fading"
    | "Full Moon Faded"
    | "Waning Gibbous Rising"
    | "Waning Gibbous Risen"
    | "Waning Gibbous"
    | "Waning Gibbous Fading"
    | "Waning Gibbous Faded"
    | "Last Quarter Rising"
    | "Last Quarter Risen"
    | "Last Quarter"
    | "Last Quarter Fading"
    | "Last Quarter Faded"
    | "Waning Crescent Rising"
    | "Waning Crescent Risen"
    | "Waning Crescent"
    | "Waning Crescent Fading"
    | "Waning Crescent Faded"
    | "New Moon Rising"
    | "New Moon Risen";

export interface Event {
    name: string;
    description: string;
    date: {
        month: number;
        day: number;
        year: number;
    };
    end?: {
        month: number;
        day: number;
        year: number;
    };
    id: string;
    note: string;
    category: string;
    timestamp?: number;
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
    displayMoons: boolean;
    displayDayNumber: boolean;
    eras: Era[];
    offset?: number;
    incrementDay: boolean;
    useCustomYears?: boolean;
    years?: Year[];
}

export interface CurrentCalendarData {
    year: number;
    month: number;
    day: number;
}
