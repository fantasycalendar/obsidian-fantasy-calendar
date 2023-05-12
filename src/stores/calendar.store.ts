import type { Calendar, FcDate } from "src/@types";
import { Writable, derived, get, writable } from "svelte/store";
import { YearStoreCache } from "./years.store";
import { dateString } from "src/utils/functions";
import { EventCache } from "./cache/event-cache";

export type CalendarStore = ReturnType<typeof createCalendarStore>;

export function createCalendarStore(calendar: Calendar) {
    const store = writable(calendar);
    const { set, update, subscribe } = store;

    const staticStore = createStaticStore(store);
    const { months } = staticStore;
    const current = derived(store, (cal) => cal.current);
    const displaying = writable({ ...calendar.current });

    /** Event Cache */
    /** This cache is a Map< year number, year event cache > */
    const eventCache = new EventCache(derived(store, (cal) => cal.events));
    const categories = derived(store, (c) => c.categories);

    /** Year Calculator Cache */
    const yearCalculator = new YearStoreCache(staticStore);

    //@ts-expect-error
    window.yearCache = yearCalculator;

    return {
        set,
        update,
        subscribe,

        updateCalendar: (calendar: Calendar) => update((cal) => calendar),
        eventCache,
        categories,
        //Readable store containing static calendar data
        staticStore,

        //Current date
        current,
        currentDisplay: derived([current, months], ([current, months]) => {
            return dateString(current, months);
        }),
        setCurrent: (date: FcDate) =>
            update((cal) => {
                cal.current = { ...date };
                return cal;
            }),

        //Displayed Date
        displaying,
        goToToday: () => displaying.set({ ...calendar.current }),
        displayingDisplay: derived(
            [displaying, months],
            ([display, months]) => {
                return dateString(display, months);
            }
        ),
        displayingMonth: derived([displaying], ([date]) =>
            yearCalculator
                .getYearFromCache(date.year)
                .getMonthFromCache(date.month)
        ),
        displayingYear: derived(
            [displaying, staticStore.years, staticStore.staticConfiguration],
            ([date, years, config]) =>
                config.useCustomYears ? years[date.year].name : date.year
        ),
        previousMonth: derived([displaying], ([displaying]) => {
            let { year, month } = displaying;
            let yearStore = yearCalculator.getYearFromCache(year);
            if (month == 0) {
                year = year - 1;
                yearStore = yearCalculator.getYearFromCache(year);
                month = get(yearStore.months).length - 1;
            } else {
                month = month - 1;
            }
            return yearStore.getMonthFromCache(month);
        }),
        goToPrevious: () =>
            displaying.update((displaying) => {
                if (displaying.month == 0) {
                    displaying.year = displaying.year - 1;
                    const year = yearCalculator.getYearFromCache(
                        displaying.year
                    );
                    const months = get(year.months);
                    displaying.month = months.length - 1;
                } else {
                    displaying.month--;
                }
                return displaying;
            }),

        nextMonth: derived([displaying], ([displaying]) => {
            let yearStore = yearCalculator.getYearFromCache(displaying.year);
            const months = get(yearStore.months);
            let month = displaying.month;
            if (displaying.month == months.length - 1) {
                yearStore = yearCalculator.getYearFromCache(
                    displaying.year + 1
                );
                month = 0;
            } else {
                month = month + 1;
            }
            return yearStore.getMonthFromCache(month);
        }),
        goToNext: () =>
            displaying.update((displaying) => {
                const year = yearCalculator.getYearFromCache(displaying.year);
                const months = get(year.months);
                if (displaying.month == months.length - 1) {
                    displaying.month = 0;
                    displaying.year++;
                } else {
                    displaying.month++;
                }
                return displaying;
            }),

        yearCalculator,
    };
}

export type StaticStore = ReturnType<typeof createStaticStore>;
function createStaticStore(store: Writable<Calendar>) {
    /** Static Calendar Data */
    const staticData = derived(store, (cal) => cal.static);
    const leapDays = derived(staticData, (data) => data.leapDays);
    const months = derived(staticData, (data) => data.months);
    const moons = derived(staticData, (data) => data.moons);
    const weekdays = derived(staticData, (data) => data.weekdays);
    const years = derived(staticData, (data) => data.years);

    const staticConfiguration = derived(staticData, (data) => {
        return {
            firstWeekDay: data.firstWeekDay,
            overflow: data.overflow,
            displayMoons: data.displayMoons,
            displayDayNumber: data.displayDayNumber,
            offset: data.offset,
            incrementDay: data.incrementDay,
            useCustomYears: data.useCustomYears,
        };
    });
    return {
        leapDays,
        months,
        moons,
        staticConfiguration,
        weekdays,
        years,
    };
}
