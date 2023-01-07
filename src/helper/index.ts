import { Events, Notice } from "obsidian";
import type FantasyCalendar from "src/main";
import { MOON_PHASES, Phase } from "src/utils/constants";
import {
    dateString,
    isValidDay,
    isValidMonth,
    isValidYear,
    wrap
} from "src/utils/functions";
import type {
    Calendar,
    CurrentCalendarData,
    Month,
    FcEvent,
    LeapDay,
    Moon
} from "src/@types";
import { DayHelper } from "./day.helper";
import { MonthHelper } from "./month.helper";



interface YearEventCache {
    events: FcEvent[];
    shouldUpdate: boolean;
    months: Map<number, MonthHelper>;
}

export default class CalendarHelper extends Events {
    addEvent(event: FcEvent) {
        const year = event.date.year;
        const month = event.date.month;

        this.refreshMonth(month, year);
    }
    refreshMonth(month: number, year: number) {
        if (!this._cache.has(year)) return;
        if (!this._cache.get(year).months.has(month)) return;
        this._cache.get(year).shouldUpdate = true;
        this._cache
            .get(year)
            .months.forEach((month) => (month.shouldUpdate = true));
        if (
            (year == this.displayed.year && month == this.displayed.month) ||
            (year == this.viewing.year && month == this.viewing.month)
        ) {
            this.trigger("month-update");
        }
    }
    refreshYear(year: number) {
        if (!this._cache.has(year)) return;
        this._cache.get(year).shouldUpdate = true;
        this._cache
            .get(year)
            .months.forEach((month) => (month.shouldUpdate = true));
        if (year == this.displayed.year || year == this.viewing.year) {
            this.trigger("month-update");
        }
    }
    standardMonths: Month[];
    /**
     * Get a day helper from cache for a given date calendar.
     */
    getDayForDate(date: CurrentCalendarData): DayHelper {
        const month = this.getMonth(date.month, date.year);
        const day = month.days[date.day - 1];
        return day;
    }
    /**
     * Get all the events that occur in a given month.
     */
    getEventsForMonth(helper: MonthHelper): FcEvent[] {
        //get from cache first

        //else
        const { year, number: month } = helper;

        if (!this._cache.has(year)) {
            this._cache.set(year, {
                events: [],
                shouldUpdate: true,
                months: new Map()
            });
        }
        if (this._cache.get(year).shouldUpdate) {
            const events = this.calendar.events.filter((event) => {
                const date = { ...event.date };
                const end = { ...event.end };

                //Year and Month match
                if (date.year == year || date.year == undefined) return true;

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
            this._cache.set(year, {
                months: this._cache.get(year).months,
                events,
                shouldUpdate: false
            });
        }

        const events = this._cache.get(year).events.filter((event) => {
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
            if (date.year > year || (date.year == year && date.month > month))
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

        return events;
    }
    /**
     * Get the display name for a year. Used mainly for custom years.
     */
    getNameForYear(year: number): string {
        if (!this.data.useCustomYears) return `${year}`;
        if (
            this.data.useCustomYears &&
            year - 1 >= 0 &&
            year <= this.data.years?.length
        ) {
            return this.data.years[year - 1].name;
        }
    }
    /**
     * Maximum number of days possible in a year.
     */
    maxDays: number;
    /**
     * Options alias.
     */
    get displayWeeks() {
        return this.calendar.displayWeeks;
    }
    /**
     * Creates an instance of CalendarHelper.
     * @param {Calendar} calendar
     * @param {FantasyCalendar} plugin
     * @memberof CalendarHelper
     */
    constructor(public calendar: Calendar, public plugin: FantasyCalendar) {
        super();
        this.displayed = { ...this.current };
        this.update(this.calendar);

        this.plugin.registerEvent(
            this.plugin.app.workspace.on(
                "fantasy-calendars-event-update",
                (tree) => {
                    if (!tree.has(this.calendar.id)) return;

                    const years = tree.get(this.calendar.id);

                    for (const year of years) {
                        if (!this._cache.has(year)) continue;
                        this.refreshYear(year);
                    }
                }
            )
        );
    }

    /**
     * Cache used to store built month helpers, events, and whether a year should update.
     */
    private _cache: Map<number, YearEventCache> = new Map();

    /**
     * Get an array of month helpers for an entire year.
     */
    getMonthsForYear(year: number) {
        if (!this._cache.has(year)) {
            this._cache.set(year, {
                events: [],
                shouldUpdate: true,
                months: new Map(
                    this.data.months.map((m, i) => [
                        i,
                        new MonthHelper(m, i, year, this)
                    ])
                )
            });
        }
        if (this._cache.get(year).months.size != this.data.months.length) {
            this._cache.set(year, {
                ...this._cache.get(year),
                months: new Map(
                    this.data.months.map((m, i) => [
                        i,
                        new MonthHelper(m, i, year, this)
                    ])
                )
            });
        }
        return Array.from(this._cache.get(year).months.values());
    }
    /**
     * Get a hash of a given date.
     *
     * Hash takes the form of `YYYYMMDD`, with months and days padded to the maximum value.
     */
    hash(date: Partial<CurrentCalendarData>) {
        if (date.year == null || date.month == null || date.day == null)
            return null;
        const months = `${this.data.months.length}`.length;
        const month = `${date.month}`.padStart(months, "0");
        const days = `${this.maxDays}`.length;
        const day = `${date.day}`.padStart(days, "0");
        return `${date.year}${month}${day}`;
    }

    /**
     * Update the calendar object to a new calendar.
     */
    update(calendar?: Calendar) {
        this.calendar = calendar ?? this.calendar;
        this.maxDays = Math.max(...this.data.months.map((m) => m.length));

        this.standardMonths = this.data.months.filter(
            (m) => m.type != "intercalary"
        );

        if (!this.calendar?.current) {
            this.calendar.current = {
                day: null,
                month: null,
                year: null
            };
        }
        if (!isValidYear(this.calendar?.current.year, this.calendar)) {
            this.calendar.current.year = 1;
        }
        if (!isValidMonth(this.calendar?.current.month, this.calendar)) {
            this.calendar.current.month = 0;
        }
        if (!isValidDay(this.calendar?.current.day, this.calendar)) {
            this.calendar.current.day = 1;
        }

        this.trigger("month-update");
        this.trigger("day-update");
    }
    /**
     * Alias for calendar categories.
     */
    get categories() {
        return this.calendar.categories;
    }
    /**
     * Alias for calendar static data.
     */
    get data() {
        return this.calendar.static;
    }
    /**
     * Alias for calendar current date.
     */
    get current() {
        return this.calendar.current;
    }
    /**
     * Alias for calendar leap days data.
     */
    get leapdays() {
        return this.data.leapDays ?? [];
    }

    /**
     * Used to track currently displayed date on the calendar.
     * Probably just need to track month and year... or a MonthHelper.
     */
    displayed: CurrentCalendarData = {
        year: null,
        month: null,
        day: null
    };
    /**
     * Used to track current viewed date (day view) on the calendar.
     * Probably just need to track a DayHelper.
     */
    viewing: CurrentCalendarData = {
        year: null,
        month: null,
        day: null
    };
    /**
     * Display string for current date.
     */
    get currentDate() {
        return dateString(this.current, this.data.months);
    }

    /**
     * Display string for displayed date.
     */
    get displayedDate() {
        return dateString(this.displayed, this.data.months);
    }
    /**
     * Display string for viewed date.
     */
    get viewedDate() {
        return dateString(this.viewing, this.data.months);
    }

    /**
     * Reset a calendar to display current date.
     */
    reset() {
        this.displayed = { ...this.current };
        this.viewing = { ...this.current };

        this.trigger("month-update");
        this.trigger("day-update");
    }

    /**
     * Set the current displayed month.
     */
    setCurrentMonth(n: number) {
        this.displayed.month = n;

        this.trigger("month-update");
    }
    /**
     * Increment viewed day and overflow months and years as necessary.
     */
    goToNextDay() {
        const day = this.getDayForDate(this.viewing);
        this.viewing.day += 1;
        if (this.viewing.day > day.month.days.length) {
            this.goToNext();
            this.viewing.month = this.displayed.month;
            this.viewing.year = this.displayed.year;
            this.viewing.day = 1;
        }
        this.trigger("day-update");
    }
    /**
     * Increment current day and overflow months and years as necessary.
     */
    goToNextCurrentDay() {
        this.current.day += 1;
        const currentMonth = this.getMonth(
            this.current.month,
            this.current.year
        );
        if (this.current.day >= currentMonth.days.length) {
            this.current.day = 1;
            this.current.month += 1;
            if (this.current.month >= this.data.months.length) {
                this.current.month = 0;
                this.current.year += 1;
            }
        }
        this.trigger("day-update");
    }
    /**
     * Get the index of the next month to be displayed, wrapping as necessary.
     */
    get nextMonthIndex() {
        return wrap(this.displayed.month + 1, this.data.months.length);
    }
    /**
     * Get the MonthHelper of the next month to be displayed.
     */
    get nextMonth() {
        return this.getMonth(this.displayed.month + 1, this.displayed.year);
    }
    /**
     * Check if the calendar can increment year. Always returns true unless the calendar has custom years defined.
     */
    canGoToNextYear(year = this.displayed.year) {
        return !this.data.useCustomYears || year < this.data.years.length;
    }
    getNextMonth() {
        if (this.plugin.data.showIntercalary) {
            return this.getMonth(this.displayed.month + 1, this.displayed.year);
        } else {
            return this.getDirectionalStandardMonthHelper(1);
        }
    }
    getNextMonthIndex() {
        const month = this.getNextMonth();
        return this.data.months.indexOf(month.data);
    }
    getPreviousMonth() {
        if (this.plugin.data.showIntercalary) {
            return this.getMonth(this.displayed.month - 1, this.displayed.year);
        } else {
            return this.getDirectionalStandardMonthHelper(-1);
        }
    }
    getPreviousMonthIndex() {
        const month = this.getPreviousMonth();
        return this.data.months.indexOf(month.data);
    }
    getDirectionalStandardMonthHelper(
        direction: 1 | -1,
        year = this.displayed.year
    ) {
        const index = this.getDirectionalStandardMonth(direction);
        return this.getMonth(index, year);
    }
    getDirectionalStandardMonth(direction: 1 | -1) {
        const current = this.data.months[this.displayed.month];
        const standardIndex = this.standardMonths.indexOf(current);
        const directionIndex = wrap(
            standardIndex + direction,
            this.standardMonths.length
        );
        const index = this.data.months.indexOf(
            this.standardMonths[directionIndex]
        );
        return index;
    }
    /**
     * Go to the next month index. Used to change months on the calendar.
     */
    goToNext() {
        const index = this.getNextMonthIndex();

        if (index < this.displayed.month) {
            if (!this.canGoToNextYear()) {
                new Notice(
                    "This is the last year. Additional years can be created in settings."
                );
                return;
            }
            this.goToNextYear();
        }
        this.setCurrentMonth(index);
    }
    /**
     * Go to the next year index. Used to change years on the calendar.
     */
    goToNextYear() {
        this.displayed.year += 1;
        this.trigger("year-update");
    }

    /**
     * Get the index of the previous month to be displayed, wrapping as necessary.
     */
    get prevMonthIndex() {
        return wrap(this.displayed.month - 1, this.data.months.length);
    }
    /**
     * Get the MonthHelper of the previous month to be displayed.
     */
    get previousMonth() {
        return this.getMonth(this.displayed.month - 1, this.displayed.year);
    }
    /**
     * Go to the previous month index. Used to change months on the calendar.
     */
    goToPrevious() {
        const index = this.getPreviousMonthIndex();

        if (index > this.displayed.month) {
            if (this.displayed.year == 1) {
                new Notice("This is the earliest year.");
                return;
            }
            this.goToPreviousYear();
        }
        this.setCurrentMonth(index);
    }
    /**
     * Go to the viewed previous day. Used to change days on the day view.
     */
    goToPreviousDay() {
        this.viewing.day -= 1;
        if (this.viewing.day < 1) {
            this.goToPrevious();
            this.viewing.month = this.displayed.month;
            this.viewing.year = this.displayed.year;
            this.viewing.day = this.currentMonth.days.length;
        }
        this.trigger("day-update");
    }
    /**
     * Go to the previous year index. Used to change years on the calendar.
     */
    goToPreviousYear() {
        this.displayed.year -= 1;
        this.trigger("year-update");
    }
    /**
     * Alias for calendar data weekdays.
     */
    get weekdays() {
        return this.data.weekdays;
    }
    /**
     * Get the MonthHelper for the currently displayed month.
     */
    get currentMonth() {
        return this.getMonth(this.displayed.month, this.displayed.year);
    }

    /**
     * Test if a leap day occurs in a given year.
     */
    testLeapDay(leapday: LeapDay, year: number) {
        return leapday.interval
            .sort((a, b) => a.interval - b.interval)
            .some(({ interval, exclusive }, index, array) => {
                if (exclusive && index == 0) {
                    return (year - leapday.offset ?? 0) % interval != 0;
                }

                if (exclusive) return;

                if (array[index + 1] && array[index + 1].exclusive) {
                    return (
                        (year - leapday.offset ?? 0) % interval == 0 &&
                        (year - leapday.offset ?? 0) %
                            array[index + 1].interval !=
                            0
                    );
                }
                return (year - leapday.offset ?? 0) % interval == 0;
            });
    }
    /**
     * Get all leapdays that occur in a given year.
     */
    leapDaysForYear(year: number) {
        return this.leapdays.filter((l) => {
            return this.testLeapDay(l, year);
        });
    }
    /**
     * Get all leapdays that occur in a given month in a specific year.
     */
    leapDaysForMonth(month: number, year = this.displayed.year) {
        return this.leapdays.filter((l) => {
            if (l.timespan != month) return false;
            return this.testLeapDay(l, year);
        });
    }

    /**
     * Get a MonthHelper for a month number in a specific year, wrapping the month number as necessary.
     *
     * Will prioritize pulling a MonthHelper from the cache.
     *
     * Direction is used to skip intercalary months.
     */
    getMonth(number: number, year: number, direction: number = 0): MonthHelper {
        const months = this.data.months;
        let index = wrap(number, months.length);

        if (number < 0) year -= 1;
        if (year == 0) return null;

        if (number >= months.length) year += 1;

        if (this._cache.has(year)) {
            if (this._cache.get(year)!.months.has(index)) {
                return this._cache.get(year)!.months.get(index);
            }
        } else {
            this._cache.set(year, {
                events: [],
                shouldUpdate: true,
                months: new Map()
            });
        }

        if (months[index].type == "intercalary" && direction != 0) {
            return this.getMonth(number + direction, year, direction);
        }

        const helper = new MonthHelper(months[index], index, year, this);
        this._cache.get(year).months.set(index, helper);
        this._cache.set(year, this._cache.get(year));
        return helper;
    }
    /**
     * Get the padded days for a given month.
     *
     * This is used to display the "overflowed" days from the previous and next month on the calendar.
     *
     * This has the side benefit of pre-caching the previous and next months, so they are built when switched to.
     */
    getPaddedDaysForMonth(month: MonthHelper) {
        let current = month.days;

        /** Get Days of Previous Month */
        let previous: DayHelper[] = [];

        const previousMonth = this.getMonth(
            month.index - 1,
            this.displayed.year,
            -1
        );
        if (month.firstWeekday > 0 && month.type == "month") {
            previous =
                previousMonth != null
                    ? previousMonth.days.slice(-month.firstWeekday)
                    : Array(month.firstWeekday).fill(null);
        }

        /** Get Days of Next Month */
        let next: DayHelper[] = [];
        const nextMonth = this.getMonth(
            month.index + 1,
            this.displayed.year,
            1
        );
        if (
            month.lastWeekday < this.weekdays.length - 1 &&
            month.type == "month"
        ) {
            next = nextMonth.days.slice(
                0,
                this.weekdays.length - month.lastWeekday - 1
            );
        }

        return {
            previous,
            current,
            next
        };
    }

    /**
     * Returns the rounded up number of weeks of the current month. Use to build calendar rows.
     */
    get weeksPerCurrentMonth() {
        return Math.ceil(
            this.getMonth(this.displayed.month, this.displayed.year).length /
                this.data.weekdays.length
        );
    }
    /**
     * Get the number of weeks in a given month.
     */
    weeksOfMonth(month: MonthHelper) {
        return Math.ceil(
            (month.length + month.firstWeekday) / this.data.weekdays.length
        );
    }
    /**
     * Get the first week number of a given month.
     *
     * TODO: Figure out how to add in ISO spec compliance here.
     */
    weekNumbersOfMonth(month: MonthHelper) {
        const daysBefore = month.daysBefore + this.firstDayOfYear(month.year);
        return Math.floor(daysBefore / this.data.weekdays.length);
    }
    /**
     * Total number of days in a year. Does not include leap days.
     */
    get daysPerYear() {
        return this.data.months
            .filter((m) => m.type === "month")
            .reduce((a, b) => a + b.length, 0);
    }
    /**
     * Get the total number of days in a year before a given month.
     */
    daysBeforeMonth(month: number, year: number, all: boolean = false) {
        if (!month || month == 0) return 0;

        return this.data.months
            .slice(0, month)
            .filter((m) => (all ? true : m.type == "month"))
            .map((m, i) => {
                const leapdays = this.leapDaysForMonth(i, year);
                return m.length + leapdays.filter((l) => !l.intercalary).length;
            })
            .reduce((a, b) => a + b, 0);
    }

    dayNumberForDate(date: CurrentCalendarData) {
        return this.daysBeforeMonth(date.month, date.year, true) + date.day;
    }

    get firstWeekday() {
        return this.data.firstWeekDay;
    }

    /**
     * Alias to get the total number of leap days that have occured before the currently displayed year.
     */
    get leapDaysBefore() {
        if (this.displayed.year == 1) return 0;
        return this.leapDaysBeforeYear(this.displayed.year - 1);
    }
    /** Get Total Number of Leap Days before a given year
     * @param tester Year to find leap days before NOT INCLUDING THIS YEAR
     */
    leapDaysBeforeYear(tester: number) {
        /** If we're checking year 1, there are no leap days. */
        if (tester == 1) return 0;
        /** Subtract 1 from tester. We're looking for leap days BEFORE the year. */
        const year = tester - 1;
        let total = 0;
        /** Iterate over each leap day. */
        for (const { interval, offset } of this.leapdays.filter(
            (l) => !l.intercalary
        )) {
            let leapdays = 0;

            /** Iterate over each condition on each leapday. */
            for (let i = 0; i < interval.length; i++) {
                const condition = interval[i];
                /** Determine how many leap days match non-exclusive rules AFTER this rule.
                 * This has to be done to avoid "double-counting" days for days that match multiple rules.
                 */
                const rest = interval
                    .slice(i + 1)
                    .filter((c) => !c.exclusive)
                    .map((c) =>
                        Math.floor(
                            (year + (c.ignore ? 0 : offset)) / c.interval
                        )
                    )
                    .reduce((a, b) => a + b, 0);
                /** Calculate how many days match this rule. */
                const calc = Math.floor(
                    (year + (condition.ignore ? 0 : offset)) /
                        condition.interval
                );
                if (condition.exclusive) {
                    /** If the rule is exlusive, subtract the result from the total, then add in the rest. */
                    leapdays -= calc;
                    leapdays += rest;
                } else {
                    /** If the rule is exlusive, add the result to the total, then subtract out the rest. */
                    leapdays += calc;
                    leapdays -= rest;
                }
            }
            total += leapdays;
        }
        return total;
    }
    /**
     * Alias to get the total number of days before the currently displayed year.
     */
    get totalDaysBefore() {
        return this.totalDaysBeforeYear(this.displayed.year);
    }
    /**
     * Get the total number of days before a given year.
     */
    totalDaysBeforeYear(year: number, all = false) {
        if (year < 1) return 0;
        return (
            Math.abs(year - 1) *
                this.data.months
                    .filter((m) => all || m.type == "month")
                    .reduce((a, b) => a + b.length, 0) +
            this.leapDaysBeforeYear(year)
        );
    }
    /**
     * Get the weekday of a given year.
     */
    firstDayOfYear(year = this.displayed.year) {
        if (!this.data.overflow) return 0;
        if (year == 1) return this.firstWeekday;

        return wrap(
            (this.totalDaysBeforeYear(year) % this.data.weekdays.length) +
                this.firstWeekday +
                (this.data.offset ?? 0),
            this.data.weekdays.length
        );
    }

    /**
     * Alias to get the moon data.
     */
    get moons() {
        return this.data.moons;
    }
    /**
     * Get the moons and their phases for a given month.
     */
    getMoonsForMonth(month: MonthHelper): Array<[Moon, Phase]>[] {
        const phases: Array<[Moon, Phase]>[] = [];

        for (const day of month.days) {
            const daysBefore =
                this.totalDaysBeforeYear(month.year, true) +
                this.daysBeforeMonth(month.number, month.year, true) +
                day.number -
                1;
            const moons: Array<[Moon, Phase]> = [];
            for (let moon of this.moons) {
                const { offset, cycle } = moon;
                const granularity = 24;

                let data = (daysBefore - offset) / cycle;
                let position = data - Math.floor(data);

                const phase = (position * granularity) % granularity;

                const options = MOON_PHASES[granularity];

                moons.push([
                    moon,
                    options[wrap(Math.round(phase), options.length)]
                ]);
            }
            phases.push(moons);
        }

        return phases;
    }
}
