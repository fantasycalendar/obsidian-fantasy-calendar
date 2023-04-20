import { prepareFuzzySearch } from "obsidian";
import type {
    Calendar,
    CurrentCalendarData,
    Day,
    Event,
    EventCategory,
    LeapDay,
    Month,
    Moon,
    StaticCalendarData,
    Week,
    Year
} from "src/@types";
import type FantasyCalendar from "src/main";
import { DEFAULT_CALENDAR } from "src/settings/settings.constants";
import {
    isValidDay,
    isValidMonth,
    isValidYear,
    nanoid
} from "src/utils/functions";
import { derived, writable } from "svelte/store";

function createStore(
    plugin: FantasyCalendar,
    existing: Calendar = DEFAULT_CALENDAR
) {
    const store = writable<Calendar>(existing);
    const { subscribe, set, update } = store;

    const staticStore = derived(store, (data) => data.static);
    const currentStore = derived(store, (data) => {
        return data.current;
    });
    const { subscribe: staticSubscribe } = staticStore;

    const staticSet = (data: StaticCalendarData) =>
        update((calendar) => {
            calendar.static = data;
            return calendar;
        });

    const monthStore = derived(staticStore, (data) => data.months);
    const weekStore = derived(staticStore, (data) => data.weekdays);
    const yearStore = derived(staticStore, (data) => data.years);
    const customYears = derived(staticStore, (data) => data.useCustomYears);
    const moonStore = derived(staticStore, (data) => data.moons);
    const displayMoons = derived(staticStore, (data) => data.displayMoons);
    const leapDayStore = derived(staticStore, (data) => data.leapDays);
    const eventStore = derived(store, (data) => data.events);
    const categoryStore = derived(store, (data) => data.categories);
    const validMonths = derived(staticStore, (data) => {
        return (
            data.months?.length &&
            data.months?.every((m) => m.name?.length) &&
            data.months?.every((m) => m.length > 0)
        );
    });
    const validWeekdays = derived(staticStore, (data) => {
        return (
            data.weekdays?.length &&
            data.weekdays?.every((d) => d.name?.length) &&
            data.firstWeekDay < (data.weekdays?.length ?? Infinity)
        );
    });
    const validYears = derived(staticStore, (data) => {
        return (
            !data.useCustomYears ||
            (data.useCustomYears &&
                data.years?.length &&
                data.years.every((y) => y.name?.length))
        );
    });
    const validName = derived(store, (calendar) => calendar.name?.length);

    const validDay = derived([store, currentStore], ([calendar, current]) => {
        return isValidDay(current.day, calendar);
    });
    const validMonth = derived([store, currentStore], ([calendar, current]) => {
        return isValidMonth(current.month, calendar);
    });
    const validYear = derived([store, currentStore], ([calendar, current]) => {
        return isValidYear(current.year, calendar);
    });
    const validDate = derived(
        [validDay, validMonth, validYear],
        ([day, month, year]) => {
            return day && month && year;
        }
    );
    const validCalendar = derived(
        [validDate, validName, validMonths, validWeekdays, validYears],
        ([validDate, validName, validMonths, validWeekdays, validYears]) =>
            validDate && validName && validMonths && validWeekdays && validYears
    );
    return {
        subscribe,
        set,
        update,
        currentStore: {
            subscribe: currentStore.subscribe,
            set: (data: CurrentCalendarData) => {
                update((calendar) => {
                    calendar.current = { ...data };
                    return calendar;
                });
            },
            update: (data: CurrentCalendarData) =>
                update((calendar) => {
                    calendar.current = { ...data };
                    return calendar;
                })
        },
        valid: validCalendar,
        validDate,
        validDay,
        validMonth,
        validMonths,
        validWeekdays,
        validYear,
        validYears,
        validName,
        setProperty<K extends keyof Calendar>(key: K, value: Calendar[K]) {
            return update((calendar) => {
                calendar[key] = value;
                return calendar;
            });
        },

        /** Setters */
        setCurrentDate: (date: CurrentCalendarData) =>
            update((cal) => {
                cal.current = { ...date };
                return cal;
            }),

        staticStore: {
            subscribe: staticSubscribe,
            set: staticSet,
            setProperty<K extends keyof StaticCalendarData>(
                key: K,
                value: StaticCalendarData[K]
            ) {
                return update((calendar) => {
                    calendar.static[key] = value;
                    return calendar;
                });
            }
        },
        weekdayStore: {
            subscribe: weekStore.subscribe,
            add: () =>
                update((data) => {
                    data.static.weekdays.push({
                        type: "day",
                        name: null,
                        id: nanoid(6)
                    });
                    return data;
                }),

            update: (id: string, day: Day) =>
                update((data) => {
                    data.static.weekdays.splice(
                        data.static.weekdays.findIndex((m) => m.id == id),
                        1,
                        day
                    );
                    return data;
                }),
            delete: (id: string) =>
                update((data) => {
                    data.static.weekdays = data.static.weekdays.filter(
                        (m) => m.id != id
                    );
                    return data;
                }),
            set: (weekdays: Week) =>
                update((data) => {
                    data.static.weekdays = [...weekdays];
                    return data;
                })
        },
        monthStore: {
            subscribe: monthStore.subscribe,
            add: () =>
                update((data) => {
                    data.static.months.push({
                        type: "month",
                        name: null,
                        length: null,
                        id: nanoid(6)
                    });
                    return data;
                }),
            update: (id: string, month: Month) =>
                update((data) => {
                    data.static.months.splice(
                        data.static.months.findIndex((m) => m.id == id),
                        1,
                        month
                    );
                    return data;
                }),
            delete: (id: string) =>
                update((data) => {
                    data.static.months = data.static.months.filter(
                        (m) => m.id != id
                    );
                    return data;
                }),
            set: (months: Month[]) =>
                update((data) => {
                    data.static.months = [...months];
                    return data;
                })
        },
        yearStore: {
            customYears,
            subscribe: yearStore.subscribe,
            add: () =>
                update((data) => {
                    data.static.years.push({
                        type: "year",
                        name: null,
                        id: nanoid(6)
                    });
                    return data;
                }),
            update: (id: string, year: Year) =>
                update((data) => {
                    data.static.years.splice(
                        data.static.years.findIndex((m) => m.id == id),
                        1,
                        year
                    );
                    return data;
                }),
            delete: (id: string) =>
                update((data) => {
                    data.static.years = data.static.years.filter(
                        (m) => m.id != id
                    );
                    return data;
                }),
            set: (years: Year[]) =>
                update((data) => {
                    data.static.years = [...years];
                    return data;
                })
        },
        eventStore: {
            subscribe: eventStore.subscribe,
            sortedStore: derived(eventStore, (events) =>
                events.sort((a, b) => {
                    if (a.date.year != b.date.year) {
                        return a.date.year - b.date.year;
                    }
                    if (a.date.month != b.date.month) {
                        return a.date.month - b.date.month;
                    }
                    return a.date.day - b.date.day;
                })
            ),
            set: (events: Event[]) =>
                update((data) => {
                    data.events = [...events];
                    return data;
                }),
            add: (event: Event) =>
                update((data) => {
                    data.events.push({ ...event });
                    return data;
                }),
            update: (id: string, event: Event) =>
                update((data) => {
                    const index = data.events.findIndex((e) => e.id === id);

                    data.events.splice(index, 1, { ...event });
                    return data;
                }),
            delete: (id: string) =>
                update((data) => {
                    data.events = data.events.filter((e) => e.id !== id);
                    return data;
                })
        },
        categoryStore: {
            subscribe: categoryStore.subscribe,
            set: (categories: EventCategory[]) =>
                update((data) => {
                    data.categories = [...categories];
                    return data;
                }),
            add: (category: EventCategory) =>
                update((data) => {
                    data.categories.push({ ...category });
                    return data;
                }),
            update: (id: string, category: EventCategory) =>
                update((data) => {
                    const index = data.categories.findIndex((e) => e.id === id);

                    data.categories.splice(index, 1, { ...category });
                    return data;
                }),
            delete: (id: string) =>
                update((data) => {
                    data.categories = data.categories.filter(
                        (c) => c.id !== id
                    );
                    return data;
                })
        },
        displayMoons: {
            subscribe: displayMoons.subscribe,
            set: (val: boolean) => {
                update((data) => {
                    data.static.displayMoons = val;
                    return data;
                });
            }
        },
        moonStore: {
            subscribe: moonStore.subscribe,
            set: (moons: Moon[]) =>
                update((data) => {
                    data.static.moons = [...moons];
                    return data;
                }),
            add: (moon: Moon) =>
                update((data) => {
                    data.static.moons.push({ ...moon });
                    return data;
                }),
            update: (id: string, moon: Moon) =>
                update((data) => {
                    const index = data.static.moons.findIndex(
                        (e) => e.id === id
                    );

                    data.static.moons.splice(index, 1, { ...moon });
                    return data;
                }),
            delete: (id: string) =>
                update((data) => {
                    data.static.moons = data.static.moons.filter(
                        (c) => c.id !== id
                    );
                    return data;
                })
        },
        leapDayDisabled: derived(
            monthStore,
            (months) => months.filter((m) => m.name?.length).length == 0
        ),
        leapDayStore: {
            subscribe: leapDayStore.subscribe,
            set: (leapDays: LeapDay[]) =>
                update((data) => {
                    data.static.leapDays = [...leapDays];
                    return data;
                }),
            add: (leapDay: LeapDay) =>
                update((data) => {
                    data.static.leapDays.push({ ...leapDay });
                    return data;
                }),
            update: (id: string, leapDay: LeapDay) =>
                update((data) => {
                    const index = data.static.leapDays.findIndex(
                        (e) => e.id === id
                    );

                    data.static.leapDays.splice(index, 1, { ...leapDay });
                    return data;
                }),
            delete: (id: string) =>
                update((data) => {
                    data.static.leapDays = data.static.leapDays.filter(
                        (c) => c.id !== id
                    );
                    return data;
                })
        }
    };
}

export default createStore;
