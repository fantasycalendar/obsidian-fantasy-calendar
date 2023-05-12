import type { Moon } from "src/@types";
import { DayCache, EntityCache, MonthCache, YearCache } from "./entity-cache";
import { Readable, derived, get, writable } from "svelte/store";

class YearMoonCache extends YearCache<Moon> {
    update([events, dirty]: [Moon[], boolean]) {
        if (dirty && events) {
            this.dirty.set(false);
        }
        return this.derived;
    }
}
class MonthMoonCache extends MonthCache<Moon> {
    update([events, dirty]: [Moon[], boolean]) {
        if (dirty && events) {
            this.dirty.set(false);
        }
        return this.derived;
    }
}
class DayMoonCache extends DayCache<Moon> {
    dirty = writable(true);
    entities: Readable<Moon[]>;
    derived: Moon[];
    update([events, dirty]: [Moon[], boolean]) {
        if (dirty && events) {
            this.dirty.set(false);
        }
        return this.derived;
    }
}

export class MoonCache extends EntityCache<Moon> {
    getYearCache(year: number): YearCache<Moon> {
        if (this.cache.has(year)) return this.cache.get(year);
        return new YearMoonCache(year, this.entities);
    }
    getMonthCache(month: number, year: number): MonthCache<Moon> {
        const yearCache = this.getYearCache(year);
        if (yearCache.cache.has(month)) return yearCache.cache.get(month);
        return new MonthMoonCache(month, year, yearCache.entities);
    }
    getDayCache(day: number, month: number, year: number): DayCache<Moon> {
        const monthCache = this.getMonthCache(month, year);
        if (monthCache.cache.has(day)) return monthCache.cache.get(day);
        return new DayMoonCache(day, month, year, monthCache.entities);
    }
}
