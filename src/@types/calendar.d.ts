import { Moon } from ".";
import { Event, EventCategory } from ".";

export interface Calendar {
    id: string;
    name: string;
    description: string;
    static: StaticCalendarData;
    current: CurrentCalendarData;
    _current?: CurrentCalendarData;
    events: Event[];
    categories: EventCategory[];
    date?: number;
    displayWeeks?: boolean;
    autoParse: boolean;
    path: string;
    supportTimelines: boolean;
    syncTimelines: boolean;
    timelineTag: string;
}
export interface StaticCalendarData {
    firstWeekDay: number;
    overflow: boolean;
    weekdays: Week;
    months: GenericMonth[];
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

export interface TimeSpan {
    type: string;
    name: string;
    id: string;
}

export interface Day extends TimeSpan {
    type: "day";
}
export interface Year extends TimeSpan {
    type: "year";
}
export type Week = Day[];
export type GenericMonth = Month | IntercalaryMonth;
export interface Month extends TimeSpan {
    length: number;
    type: "month";
}
export interface IntercalaryMonth extends TimeSpan {
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
    numbered?: boolean;
    after?: number;
}

export interface Season {
    name: string;
    start: {
        month: Month;
        day: Day;
    };
}

export interface Era {
    id: string;
    name: string;
    format: string;
    restart: boolean;
    endsYear: boolean;
    event: boolean;
    start: CurrentCalendarData;
    eventDescription?: string;
    eventCategory?: string;
}
