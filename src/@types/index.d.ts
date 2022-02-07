import type { Recurring } from "src/settings/settings";

export * from "./calendar";
export * from "./leapday";
export * from "./event";
export * from "./moons";

import type { Calendar } from "./calendar";

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
    exit: {
        saving: boolean;
        event: boolean;
    };
}
