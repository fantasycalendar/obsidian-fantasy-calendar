import type { Recurring } from "src/settings/settings";
import type Calendar__SvelteComponent_ from "src/view/day/Calendar.svelte";

export * from "./calendar";
export * from "./leapday";
export * from "./event";
export * from "./moons";

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
    exitWithoutSaving: boolean;
}
