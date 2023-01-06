export interface FcEvent {
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
    formulas?: EventFormula[];
}

type EventFormula = FormulaInterval;
interface FormulaInterval {
    type: "interval";
    number: number;
    timespan: "days";
}

export interface ColorEvent extends FcEvent {
    color: string;
}

export interface FcEventCategory {
    name: string;
    color: string;
    id: string;
}

export interface FcEventCondition {}
