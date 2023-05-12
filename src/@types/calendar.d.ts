import { Moon } from ".";
import { FcEvent, FcEventCategory } from ".";

export interface FcDate {
    day: number;
    month: number;
    year: number;
}

export interface Calendar {
    id: string;
    name: string;
    description: string;
    static: StaticCalendarData;
    current: FcDate;
    events: FcEvent[];
    categories: FcEventCategory[];
    date?: number;
    displayWeeks?: boolean;
    autoParse: boolean;
    path: string;
    supportTimelines: boolean;
    syncTimelines: boolean;
    timelineTag: string;
    dateFormat?: string;
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

export interface FcDate {
    year: number;
    month: number;
    day: number;
}

export interface TimeSpan {
    type: string;
    name: string;
    id: string;
}

interface BaseDay extends TimeSpan {
    type: "day" | "leapday";
}
export interface Day extends BaseDay {
    type: "day";
}
export interface Year extends TimeSpan {}
export type Week = Day[];
interface BaseMonth extends TimeSpan {
    length: number;
    interval: number;
    offset: number;
    type: "month" | "intercalary";
}
export interface RegularMonth extends BaseMonth {
    type: "month";
    week?: Week;
}
export interface IntercalaryMonth extends BaseMonth {
    type: "intercalary";
}
export type Month = RegularMonth | IntercalaryMonth;
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
export interface LeapDay extends BaseDay {
    type: "leapday";
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
    start: FcDate;
    eventDescription?: string;
    eventCategory?: string;
}
