export * from "./calendar";
export * from "./event";
export * from "./moons";

import type { Calendar } from "./calendar";

export type Nullable<T> = T | null;

export interface FantasyCalendarData {
    addToDefaultIfMissing: boolean;
    calendars: Calendar[];
    configDirectory: string;
    currentCalendar: string;
    dailyNotes: boolean;
    dateFormat: string;
    defaultCalendar: string;
    eventFrontmatter: boolean;
    eventPreview: boolean;
    exit: {
        saving: boolean;
        event: boolean;
        calendar: boolean;
    };
    parseDates: boolean;
    settingsToggleState: {
        calendars: boolean;
        events: boolean;
        advanced: boolean;
    };
    showIntercalary: boolean;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    debug: boolean;
}
