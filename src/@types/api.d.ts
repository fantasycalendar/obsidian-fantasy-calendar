import {
    Moon,
    Phase,
    FcEvent,
    FcDate,
    LeapDay,
    FcEventCategory
} from ".";

declare class API {
    getCalendars(): Calendar[];
    getMoons(
        date?: FcDate,
        name?: string
    ): Array<{ moon: Moon; phase: Phase; icon: HTMLSpanElement }>;
    getDay(
        date: { year: number; month: string; day: number },
        calendar: Calendar | string
    ): Day;
    /**
     *
     * @param date Date object using a ZERO INDEXED month.
     * @param calendar Calendar object or name of calendar.
     */
    getDay(
        date: { year: number; month: number; day: number },
        calendar: Calendar | string
    ): Day;

    addCategoryToCalendar(
        category: FcEventCategory,
        calendar: Calendar | string = this.plugin.defaultCalendar
    ): Promise<void>;
}

export type Day = {
    moons: [Moon, Phase][];
    events: FcEvent[];
    date: FcDate;
    longDate: {
        day: number;
        month: string;
        year: number;
    };
    leapDay: LeapDay;
    weekday: number;
    displayDate: string;
};

export = API;
