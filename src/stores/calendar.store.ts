import type { Calendar, FcDate, MoonState } from "src/@types";
import { Readable, Writable, derived, get, writable } from "svelte/store";
import { YearCalculatorCache, YearStoreCache } from "./years.store";
import { dateString } from "src/utils/functions";
import { EventCache } from "./cache/event-cache";
import { MoonCache } from "./cache/moon-cache";
import FantasyCalendar from "src/main";
import { CreateEventModal } from "src/settings/modals/event/event";

export type CalendarStore = ReturnType<typeof createCalendarStore>;

export function createCalendarStore(
    calendar: Calendar,
    plugin: FantasyCalendar
) {
    const store = writable(calendar);
    const { set, update, subscribe } = store;

    const staticStore = createStaticStore(store);

    const displayWeeks = derived(store, (cal) => cal.displayWeeks);

    //TODO: Move this to UI
    const current = derived(store, (cal) => cal.current);
    //TODO

    const displaying = writable({ ...calendar.current });
    const viewing = writable<FcDate | null>();

    /** Event Cache */
    /** This cache is a Map< year number, year event cache > */
    const eventCache = new EventCache(derived(store, (cal) => cal.events));
    const categories = derived(store, (c) => c.categories);

    /** Year Calculator Cache */
    const yearCalculator = new YearStoreCache(staticStore);
    const moonStates: Readable<MoonState[]> = derived(
        staticStore.moons,
        (moons) =>
            moons.map((m) => {
                return { ...m, phase: undefined };
            })
    );
    const moonCache = new MoonCache(moonStates, yearCalculator);

    //@ts-expect-error
    window.yearCache = yearCalculator;

    return {
        set,
        update,
        subscribe,

        updateCalendar: (calendar: Calendar) => update((cal) => calendar),
        eventCache,
        addEvent: (date: FcDate) => {
            const modal = new CreateEventModal(plugin, calendar, null, date);

            modal.onClose = async () => {
                if (!modal.saved) return;
                calendar.events.push(modal.event);
                eventCache.invalidate(modal.event.date);

                await plugin.saveCalendars();
            };

            modal.open();
        },

        moonCache,
        categories,
        //Readable store containing static calendar data
        staticStore,
        displayWeeks,

        getEphemeralStore: () =>
            getEphemeralStore(store, staticStore, calendar, yearCalculator),

        yearCalculator,
    };
}

export type EphemeralStore = ReturnType<typeof getEphemeralStore>;
export function getEphemeralStore(
    store: Writable<Calendar>,
    staticStore: StaticStore,
    base: Calendar,
    yearCalculator: YearStoreCache
) {
    const current = writable({ ...base.current });

    const displaying = writable({ ...base.current });
    const viewing = writable<FcDate | null>();
    return {
        current,
        currentDisplay: derived([current, store], ([current, calendar]) => {
            return dateString(current, calendar);
        }),
        setCurrentDate: (date: FcDate) => current.set({ ...date }),

        //Displayed Date
        displaying,
        goToToday: () => displaying.set({ ...get(current) }),
        displayDate: (date: FcDate = get(current)) =>
            displaying.set({ ...date }),
        displayingDisplay: derived(
            [displaying, store],
            ([display, calendar]) => {
                return dateString(display, calendar);
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
                return decrementMonth(displaying, yearCalculator);
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
                return incrementMonth(displaying, yearCalculator);
            }),

        //Viewed Date (day view)
        viewing,
        goToPreviousDay: () =>
            viewing.update((viewing) => {
                if (!viewing) return viewing;
                return decrementDay(viewing, yearCalculator);
            }),
        goToNextDay: () =>
            viewing.update((viewing) => {
                if (!viewing) return viewing;
                return incrementDay(viewing, yearCalculator);
            }),
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

function incrementMonth(date: FcDate, yearCalculator: YearStoreCache) {
    const next = { ...date };
    const year = yearCalculator.getYearFromCache(date.year);
    const months = get(year.months);
    if (next.month == months.length - 1) {
        next.month = 0;
        next.year++;
    } else {
        next.month++;
    }
    return next;
}
function decrementMonth(date: FcDate, yearCalculator: YearStoreCache) {
    const next = { ...date };
    if (next.month == 0) {
        next.year = next.year - 1;
        const year = yearCalculator.getYearFromCache(next.year);
        const months = get(year.months);
        next.month = months.length - 1;
    } else {
        next.month--;
    }
    return next;
}

function incrementDay(date: FcDate, yearCalculator: YearStoreCache) {
    let next = { ...date };
    const days = get(
        yearCalculator.getYearFromCache(next.year).getMonthFromCache(next.month)
            .days
    );
    if (next.day + 1 > days) {
        next = incrementMonth(date, yearCalculator);
        next.day = 1;
    } else {
        next.day++;
    }
    return next;
}
function decrementDay(date: FcDate, yearCalculator: YearStoreCache) {
    let next = { ...date };

    if (next.day - 1 <= 0) {
        next = decrementMonth(date, yearCalculator);
        next.day = get(
            yearCalculator
                .getYearFromCache(next.year)
                .getMonthFromCache(next.month).days
        );
    } else {
        next.day--;
    }
    return next;
}
