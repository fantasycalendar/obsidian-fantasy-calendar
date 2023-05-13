import type { FcDate } from "src/@types";
import { Readable, Writable, derived, get, writable } from "svelte/store";

abstract class CacheItem<T> {
    constructor(public toConsider: Readable<T[]>) {}
    derived: T[] = [];
    dirty: Writable<boolean> = writable(true);
    entities: Readable<T[]> = derived(
        [this.toConsider, this.dirty],
        ([entities, dirty]) => {
            this.derived = this.update([entities, dirty]);
            this.dirty.set(false);
            return this.derived;
        }
    );
    abstract update([entities, dirty]: [T[], boolean]): T[];
}
abstract class Cache<T> extends CacheItem<T> {
    cache: Map<number, CacheItem<T>>;
}
export abstract class YearCache<T> extends Cache<T> {
    constructor(public year: number, toConsider: Readable<T[]>) {
        super(toConsider);
    }
    cache: Map<number, MonthCache<T>> = new Map();
}
export abstract class MonthCache<T> extends Cache<T> {
    constructor(
        public month: number,
        public year: number,
        toConsider: Readable<T[]>
    ) {
        super(toConsider);
    }
    cache: Map<number, DayCache<T>> = new Map();
}
export abstract class DayCache<T> extends CacheItem<T> {
    constructor(
        public day: number,
        public month: number,
        public year: number,
        toConsider: Readable<T[]>
    ) {
        super(toConsider);
    }
}

export abstract class EntityCache<T> {
    cache: Map<number, YearCache<T>> = new Map();
    constructor(public entities: Readable<T[]>) {}

    abstract getYearCache(year: number): YearCache<T>;
    abstract getMonthCache(month: number, year: number): MonthCache<T>;
    abstract getDayCache(day: number, month: number, year: number): DayCache<T>;

    public invalidate(date: FcDate) {
        if (!this.cache.has(date.year)) return;
        const year = this.cache.get(date.year);
        year.dirty.set(true);

        if (!year.cache.has(date.month)) return;
        const month = year.cache.get(date.month);
        month.dirty.set(true);

        if (!month.cache.has(date.day)) return;
        const day = month.cache.get(date.day);
        day.dirty.set(true);
    }
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
