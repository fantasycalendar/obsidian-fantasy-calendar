export interface Calendar {
    id: string;
    name: string;
    description: string;
    static: StaticCalendarData;
    current: CurrentCalendarData;
    events: Event[];
}

export interface FantasyCalendarData {
    calendars: Calendar[];
}

export interface TimeSpan {
    type: string;
    name: string;
    length: number;
    id: string;
}

export interface Day extends TimeSpan {
    type: "day";
}
export type Week = Day[];
export interface Month extends TimeSpan {
    type: "month";
}

interface LeapDay extends Day {
    interval: number;
    after: number;
    month: Month;
}

interface Season {
    name: string;
    start: {
        month: Month;
        day: Day;
    };
}
interface Moon {
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
        month: Month;
        day: Day;
        time: string;
    };
}

interface StaticCalendarData {
    firstWeekDay: number;
    overflow: boolean;
    week: Week;
    months: Month[];
    leapDays: LeapDay[];
    moons: Moon[];
    seasons: Season[];
}

interface CurrentCalendarData {
    year: number;
    month: number;
    day: number;
}
