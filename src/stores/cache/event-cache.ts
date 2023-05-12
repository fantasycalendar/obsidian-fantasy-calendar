import type { FcEvent } from "src/@types";
import { DayCache, EntityCache, MonthCache, YearCache } from "./entity-cache";
import { Readable, derived, get, writable } from "svelte/store";

class YearEventCache implements YearCache<FcEvent> {
    cache: Map<number, MonthCache<FcEvent>> = new Map();
    dirty = writable(true);
    entities: Readable<FcEvent[]>;
    derived: FcEvent[];
}
class MonthEventCache implements MonthCache<FcEvent> {
    cache: Map<number, DayCache<FcEvent>> = new Map();
    dirty = writable(true);
    entities: Readable<FcEvent[]>;
    derived: FcEvent[];
}
class DayEventCache implements DayCache<FcEvent> {
    dirty = writable(true);
    entities: Readable<FcEvent[]>;
    derived: FcEvent[];
}

export class EventCache extends EntityCache<FcEvent> {
    getYearCache(year: number): YearCache<FcEvent> {
        if (this.cache.has(year)) return this.cache.get(year);
        const cache = new YearEventCache();
        cache.entities = derived(
            [this.entities, cache.dirty],
            ([events, dirty]) => {
                if (dirty && events) {
                    cache.derived = events.filter((event) => {
                        const date = { ...event.date };
                        const end = { ...event.end };

                        //Year and Month match
                        if (date.year == year || date.year == undefined)
                            return true;

                        //Event is after the month
                        if (date.year > year) return false;

                        //No end date and event is before the month
                        if (!end && !event.formulas?.length && date.year < year)
                            return false;

                        if (
                            date.year <= year &&
                            (end?.year >= year || event.formulas?.length)
                        )
                            return true;

                        return false;
                    });
                    cache.dirty.set(false);
                }
                return cache.derived;
            }
        );
        return cache;
    }
    getMonthCache(month: number, year: number): MonthCache<FcEvent> {
        const yearCache = this.getYearCache(year);
        if (yearCache.cache.has(month)) return yearCache.cache.get(month);
        const cache = new MonthEventCache();
        cache.entities = derived(
            [yearCache.entities, cache.dirty],
            ([events, dirty]) => {
                if (dirty && events) {
                    cache.derived = events.filter((event) => {
                        const date = { ...event.date };
                        const end = { ...event.end };

                        //No-month events are on every month.
                        if (date.month == undefined) return true;

                        //Year and Month match
                        if (
                            (date.year == year || date.year == undefined) &&
                            date.month == month
                        )
                            return true;

                        //Event is after the month
                        if (
                            date.year > year ||
                            (date.year == year && date.month > month)
                        )
                            return false;

                        //No end date and event is before the month
                        if (
                            !end &&
                            !event.formulas?.length &&
                            (date.month != month || date.year < year)
                        )
                            return false;

                        if (date.year == undefined) end.year = date.year = year;
                        if (
                            (date.year <= year || date.month <= month) &&
                            (event.formulas?.length ||
                                (end.year >= year && end.month >= month))
                        )
                            return true;

                        return false;
                    });
                    cache.dirty.set(false);
                }
                return cache.derived;
            }
        );
        return cache;
    }
    getDayCache(day: number, month: number, year: number): DayCache<FcEvent> {
        const monthCache = this.getMonthCache(month, year);
        if (monthCache.cache.has(day)) return monthCache.cache.get(day);

        const cache = new DayEventCache();
        cache.entities = derived(
            [monthCache.entities, cache.dirty],
            ([events, dirty]) => {
                if (dirty && events) {
                    cache.derived = events.filter((event) => {
                        if (
                            (!event.date.year || event.date.year == year) &&
                            (!event.date.month || event.date.month == month) &&
                            event.date.day == day
                        )
                            return true;
                        if (!event.end && !event.formulas?.length) return false;
                    });
                }
                return cache.derived;
            }
        );
        return cache;
    }
}
