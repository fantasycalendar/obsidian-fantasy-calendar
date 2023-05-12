import type { FcDate } from "src/@types";
import { Readable, Writable, get, readable } from "svelte/store";

interface CacheItem<T> {
    entities: Readable<T[]>;
    derived: T[];
    dirty: Writable<boolean>;
}
interface Cache<T> extends CacheItem<T> {
    cache: Map<number, CacheItem<T>>;
}
/* type EntityCache<T> = Map<number, YearCache<T>>; */
export interface YearCache<T> extends Cache<T> {
    cache: Map<number, MonthCache<T>>;
}
export interface MonthCache<T> extends Cache<T> {
    cache: Map<number, DayCache<T>>;
}
export interface DayCache<T> extends CacheItem<T> {}

export abstract class EntityCache<T> {
    cache: Map<number, YearCache<T>> = new Map();
    constructor(public entities: Readable<T[]>) {
        //@ts-expect-error
        window.EntityCache = this;
    }

    abstract getYearCache(year: number): YearCache<T>;
    abstract getMonthCache(month: number, year: number): MonthCache<T>;
    abstract getDayCache(day: number, month: number, year: number): DayCache<T>;

    public getItemsOrRecalculate(date: FcDate): Readable<T[]> {
        const { day, month, year } = date;
        if (!this.cache.has(year)) {
            this.cache.set(year, this.getYearCache(year));
        }
        const yearCache = this.cache.get(year);
        let dirtyYear = get(yearCache.dirty);
        if (!yearCache.cache.has(month)) {
            yearCache.cache.set(month, this.getMonthCache(month, year));
        }
        const monthCache = yearCache.cache.get(month);
        let dirtyMonth = get(monthCache.dirty);
        if (dirtyYear && !dirtyMonth) {
            monthCache.dirty.set(true);
        }

        if (!monthCache.cache.has(day)) {
            monthCache.cache.set(day, this.getDayCache(day, month, year));
        }
        const dayCache = monthCache.cache.get(day);
        if (dirtyMonth && !get(dayCache.dirty)) {
            dayCache.dirty.set(true);
        }
        return monthCache.cache.get(day).entities;
    }
}
