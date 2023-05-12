import { Nullable } from ".";

export interface FcEventSort {
    timestamp: number;
    order: string;
}
export interface FcEventDate {
    year: Nullable<number>,
    month: Nullable<number>,
    day: Nullable<number>
}

export interface FcEvent {
    name: string;
    description: string;
    date: FcEventDate;
    end?: FcEventDate;
    id: string;
    note: string;
    category: string;
    sort: FcEventSort;
    formulas?: EventFormula[];
    img?: string;
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
