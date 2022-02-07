export interface ImportedCalendar {
    name: string;
    static_data: {
        year_data: {
            first_day: number;
            overflow: boolean;
            global_week: string[];
            timespans: ImportedMonth[];
            leap_days: ImportedLeapDay[];
        };
        moons: ImportedMoon[];
        clock: Record<any, any>;
        seasons: Record<any, any>;
        eras: any[];
    };
    dynamic_data: {
        year: number;
        timespan: number;
        day: number;
        epoch: number;
        custom_location: boolean;
        location: string;
        current_era: number;
        hour: number;
        minute: number;
    };
    events: ImportedEvent[];
    categories: ImportedCategory[];
}

interface ImportedMonth {
    name: string;
    type: "month" | "intercalary";
    length: number;
    interval: number;
    offset: number;
}

interface ImportedLeapDay {
    name: string;
    intercalary: boolean;
    timespan: number;
    adds_week_day: boolean;
    day: number;
    week_day: string;
    interval: string;
    offset: number;
    not_numbered: boolean;
    show_text: boolean;
}

interface ImportedMoon {
    name: string;
    cycle: number;
    shift: number;
    granularity: number;
    color: string;
    shadow_color?: string;
    hidden: boolean;
}

interface ImportedEvent {
    id: number;
    name: string;
    data: {
        has_duration: boolean;
        duration: number;
        show_first_last: boolean;
        limited_repeat: boolean;
        limited_repeat_num: number;
        conditions: ImportedEventCondition;
        connected_events: [];
        date: number[];
    };
    description: string;
    event_category_id: string;
    calendar_id: string;
    settings: {
        color: string;
        text: string;
        hide: boolean;
        hide_full: boolean;
        print: boolean;
    };
    created_at: string;
    updated_at: string;
    sort_by: number;
    creator_id: number;
}
interface ImportedEventCondition {
    [n: number]: string[] | ImportedEventCondition;
}

interface ImportedCategory {
    id: number;
    name: string;
    calendar_id: string;
    category_settings: {
        hide: boolean;
        player_usable: boolean;
    };
    event_settings: {
        color: string;
        text: string;
        hide: boolean;
        print: boolean;
    };
    created_at: string;
    updated_at: string;
    sort_by: number;
}
