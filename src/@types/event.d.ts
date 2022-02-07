export interface Event {
    name: string;
    description: string;
    date: {
        month: number;
        day: number;
        year: number;
    };
    end?: {
        month: number;
        day: number;
        year: number;
    };
    id: string;
    note: string;
    category: string;
    timestamp?: number;
    auto?: boolean;
}

export interface ColorEvent extends Event {
    color: string;
}

export interface EventCategory {
    name: string;
    color: string;
    id: string;
}

export interface EventCondition {}
