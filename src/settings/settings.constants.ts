import type { Calendar, FantasyCalendarData } from "src/@types";

export const DEFAULT_CALENDAR: Calendar = {
    name: null,
    description: null,
    id: null,
    static: {
        incrementDay: false,
        firstWeekDay: null,
        overflow: true,
        weekdays: [],
        months: [],

        moons: [],
        displayMoons: true,
        displayDayNumber: false,
        leapDays: [],
        eras: []
    },
    current: {
        year: null,
        month: null,
        day: null
    },
    events: [],
    categories: [],
    autoParse: false,
    path: "/",
    supportTimelines: false,
    syncTimelines: true,
    timelineTag: "#timeline"
};

export const DEFAULT_DATA: FantasyCalendarData = {
    addToDefaultIfMissing: true,
    calendars: [],
    configDirectory: null,
    currentCalendar: null,
    dailyNotes: false,
    dateFormat: "YYYY-MM-DD",
    defaultCalendar: null,
    eventPreview: false,
    exit: {
        saving: false,
        event: false,
        calendar: false
    },
    eventFrontmatter: false,
    parseDates: false,
    settingsToggleState: {
        calendars: false,
        events: false,
        advanced: true
    },
    showIntercalary: false,
    version: {
        major: null,
        minor: null,
        patch: null
    },
    debug: false
};
