import type { Month } from "src/@types";
import { StaticStore } from "./calendar.store";
import { YearStore } from "./years.store";
import { derived, readable } from "svelte/store";
import { wrap } from "src/utils/functions";

export class MonthStore {
    dayCache = new Map<number, MonthStore>();
    constructor(
        public month: Month,
        public year: YearStore,
        public staticStore: StaticStore
    ) {}
    get name() {
        return this.month.name;
    }
    index = derived([this.year.months], ([months]) => {
        return months.indexOf(this.month);
    });
    weekdays = derived([this.staticStore.weekdays], ([week]) => {
        if (this.month.type == "intercalary") return week;
        return this.month.week ?? week;
    });
    daysBefore = derived(
        [this.index, this.year.leapDays, this.year.months],
        ([index, leapDays, months]) => {
            return (
                months.slice(0, index).reduce((a, b) => a + b.length, 0) +
                leapDays.filter((l) => l.timespan < index).length
            );
        }
    );
    firstDay = derived(
        [this.year.firstDay, this.daysBefore, this.weekdays],
        ([firstDayOfYear, daysBefore, weekdays]) => {
            return wrap(
                (daysBefore % weekdays.length) + firstDayOfYear,
                weekdays.length
            );
        }
    );
    leapDays = derived(
        [this.year.leapDays, this.index],
        ([leapDays, index]) => {
            return leapDays.filter((l) => {
                return l.timespan == index;
            });
        }
    );
    days = derived(this.leapDays, (leapDays) => {
        return this.month.length + leapDays.length;
    });
    lastDay = derived(
        [this.year.firstDay, this.daysBefore, this.weekdays, this.days],
        ([firstDayOfYear, daysBefore, weekdays, days]) => {
            console.log("🚀 ~ file: month.store.ts:71 ~ days:", days);

            return wrap(
                (daysBefore % weekdays.length) + firstDayOfYear + days,
                weekdays.length
            );
        }
    );
    weeks = derived(
        [this.weekdays, this.lastDay],
        ([weekdays, lastDay]) =>
            Math.ceil(this.month.length / weekdays.length) +
            (weekdays.length - lastDay <= 3 ? 1 : 0)
    );
    getMonthFromCache(day: number) {
        /* if (!this.dayCache.has(month)) {
            this.dayCache.set(
                month,
                createMonthStore(month, this, this.staticStore)
            );
        } */
        return this.dayCache.get(day);
    }
}
