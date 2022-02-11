import type { Recurring } from "src/settings/settings";

export * from "./calendar";
export * from "./leapday";
export * from "./event";
export * from "./moons";

import type { Calendar } from "./calendar";

export interface FantasyCalendarData {
    addToDefaultIfMissing: boolean;
    calendars: Calendar[];
    configDirectory: string;
    currentCalendar: string;
    dailyNotes: boolean;
    dateFormat: string;
    defaultCalendar: string;
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
    };
    showIntercalary: boolean;
    supportTimelines: boolean;
    syncTimelines: boolean;
    timelineTag: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
}
