import type { Recurring } from "src/settings/settings";

export * from "./calendar";
export * from "./leapday";
export * from "./event";
export * from "./moons";

import type { Calendar } from "./calendar";

export interface FantasyCalendarData {
    addToDefaultIfMissing: boolean;
    calendars: Calendar[];
    currentCalendar: string;
    defaultCalendar: string;
    eventPreview: boolean;
    eventFrontmatter: boolean;
    configDirectory: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    parseDates: boolean;
    dateFormat: string;
    dailyNotes: boolean;
    supportTimelines: boolean;
    timelineTag: string;
    syncTimelines: boolean;
    settingsToggleState: {
        calendars: boolean;
        events: boolean;
    };
    exit: {
        saving: boolean;
        event: boolean;
        calendar: boolean;
    };
}
