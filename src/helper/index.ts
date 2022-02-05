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
    Event,
    LeapDay,
    Moon
} from "../@types";

export class MonthHelper {
    days: DayHelper[] = [];
    daysBefore: number;
    leapDays: LeapDay[] = [];
    shouldUpdateEvents: boolean = false;

    get id() {
        return this.data.id;
    }
    get index() {
        return this.calendar.data.months.indexOf(this.data);
    }
    get name() {
        return this.data.name;
    }
    get length() {
        return this.days.length;
    }

    get firstWeekday() {
        if (!this.calendar.data.overflow) return 0;
        return this.days[0].weekday;
    }

    //TODO: Had to add leapday to this to calculate padding correctly
    //TODO: Need to fix next month
    get lastWeekday() {
        return this.days[this.days.length - 1].weekday;
    }

    get type() {
        return this.data.type;
    }
    events: Event[];
    getEventsOnDay(day: CurrentCalendarData) {
        if (!this.events || !this.events.length || this.shouldUpdateEvents) {
            this.events = this.calendar.eventsForMonth(this);
        }
        return this.events.filter((event) => {
            if (event.date.day == day.day) return true;
            if (!event.end) return false;
            const start = { ...event.date };
            const end = { ...event.end };

            if (!start.year) start.year = end.year = this.year;
            if (!start.month) start.month = end.month = this.number;
            const hash = Number(this.calendar.hash(day));
            if (
                Number(this.calendar.hash(start)) <= hash &&
                hash <= Number(this.calendar.hash(end))
            )
                return true;
        });
    }
    shouldUpdateMoons = false;
    moons: Array<[Moon, Phase]>[];
    getMoonsForDay(day: CurrentCalendarData) {
        if (!this.moons || !this.moons.length || this.shouldUpdateMoons) {
            this.moons = this.calendar.getMoonsForMonth(this);
        }
        return this.moons[day.day - 1];
    }
    constructor(
        public data: Month,
        public number: number,
        public year: number,
        public calendar: CalendarHelper
    ) {
        this.leapDays = this.calendar.leapDaysForMonth(this.number, year);
        this.daysBefore = this.calendar.daysBeforeMonth(this.number, this.year);

        this.days = [
            ...new Array(
                data.length +
                    this.leapDays.filter(
                        (l) => !l.intercalary || (l.intercalary && l.numbered)
                    ).length
            ).keys()
        ].map((k) => {
            return new DayHelper(
                this,
                k + 1,
                this.leapDays.find((leapday) => leapday.after == k)
            );
        });
    }
}

export class DayHelper {
    private _events: Event[];
    get calendar() {
        return this.month.calendar;
    }
    get date() {
        return {
            day: this.number,
            month: this.month.number,
            year: this.year
        };
    }
    get events(): Event[] {
        if (
            !this._events ||
            !this._events.length ||
            this.month.shouldUpdateEvents
        ) {
            this._events = this.month.getEventsOnDay(this.date);
        }
        return this._events;
    }
    get longDate() {
        return {
            day: this.number,
            month: this.month.name,
            year: this.year
        };
    }
    /** Days before this day in the year. */
    get daysBefore() {
        return (
            this.month.daysBefore +
            this.number -
            1 -
            this.month.leapDays.filter(
                (l) => l.numbered && l.after < this.number - 1
            ).length
        );
    }
    get year() {
        return this.month.year;
    }
    get weekday() {
        const firstOfYear = this.calendar.firstDayOfYear(this.year);
        return wrap(
            (this.daysBefore % this.calendar.weekdays.length) + firstOfYear,
            this.calendar.weekdays.length
        );
    }
    get isCurrentDay() {
        return (
            this.number == this.calendar.current.day &&
            this.month.number == this.calendar.current.month &&
            this.month.year == this.calendar.current.year
        );
    }
    get isDisplaying() {
        return (
            this.number == this.calendar.viewing.day &&
            this.calendar.displayed.year == this.calendar.viewing.year &&
            this.calendar.displayed.month == this.calendar.viewing.month
        );
    }
    private _moons: Array<[Moon, Phase]>;
    get moons() {
        if (!this._moons || !this._moons.length) {
            this._moons = this.month.getMoonsForDay(this.date);
        }
        return this._moons;
    }

    constructor(
        public month: MonthHelper,
        public number: number,
        public leapday?: LeapDay
    ) {}
}

export default class CalendarHelper extends Events {
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
    eventsForMonth(helper: MonthHelper): Event[] {
        //get from cache first

        //else
        const { year, number: month } = helper;
        const events = this.calendar.events.filter((event) => {
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
            if (!end && (date.month != month || date.year < year)) return false;

            if (date.year == undefined) end.year = date.year = year;
            if (
                (date.year <= year || date.month <= month) &&
                end.year >= year &&
                end.month >= month
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
        window.calendar = this;
        //TODO: Tell existing months / days to update.
        this.plugin.registerEvent(
            this.plugin.app.workspace.on(
                "fantasy-calendars-event-update",
                (tree) => {
                    if (!tree.has(this.calendar.id)) return;

                    const years = tree.get(this.calendar.id);

                    for (const [year, months] of years) {
                        if (!this._cache.has(year)) continue;
                        for (const month of months) {
                            if (!this._cache.get(year).has(month)) continue;
                            this._cache
                                .get(year)
                                .get(month).shouldUpdateEvents = true;
                            if (
                                (year == this.displayed.year &&
                                    month == this.displayed.month) ||
                                (year == this.viewing.year &&
                                    month == this.viewing.month)
                            ) {
                                this.trigger("month-update");
                            }
                        }
                    }
                }
            )
        );

        /* window.calendar = this; */
    }

    /**
     * Cache used to store built month helpers.
     */
    private _cache: Map<number, Map<number, MonthHelper>> = new Map();

    /**
     * Get an array of month helpers for an entire year.
     */
    getMonthsForYear(year: number) {
        if (!this._cache.has(year)) {
            this._cache.set(
                year,
                new Map(
                    this.data.months.map((m, i) => [
                        i,
                        new MonthHelper(m, i, year, this)
                    ])
                )
            );
        }
        return Array.from(this._cache.get(year).values());
    }
    /**
     * Get a hash of a given date.
     *
     * Hash takes the form of `YYYYMMDD`, with months and days padded to the maximum value.
     */
    hash(date: CurrentCalendarData) {
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
        this.viewing.day += 1;
        const currentMonth = this.getMonth(
            this.displayed.month,
            this.displayed.year
        );
        if (this.viewing.day > currentMonth.days.length) {
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
    /**
     * Go to the next month index. Used to change months on the calendar.
     */
    goToNext() {
        if (this.nextMonthIndex < this.displayed.month) {
            if (!this.canGoToNextYear()) {
                new Notice(
                    "This is the last year. Additional years can be created in settings."
                );
                return;
            }
            this.goToNextYear();
        }
        this.setCurrentMonth(this.nextMonthIndex);
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
        if (this.prevMonthIndex > this.displayed.month) {
            if (this.displayed.year == 1) {
                new Notice("This is the earliest year.");
                return;
            }
            this.goToPreviousYear();
        }
        this.setCurrentMonth(this.prevMonthIndex);
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
     * TODO: What is the intercalary behavior? Need to document this, because I can't remember.
     */
    getMonth(number: number, year: number, direction: number = 0): MonthHelper {
        const months = this.data.months;
        let index = wrap(number, months.length);

        if (number < 0) year -= 1;
        if (year == 0) return null;

        if (number >= months.length) year += 1;

        if (this._cache.has(year)) {
            if (this._cache.get(year)!.has(index)) {
                return this._cache.get(year)!.get(index);
            }
        } else {
            this._cache.set(year, new Map());
        }

        if (months[index].type == "intercalary" && direction != 0) {
            return this.getMonth(number + direction, year, direction);
        }

        const helper = new MonthHelper(months[index], index, year, this);
        this._cache.set(year, this._cache.get(year).set(index, helper));
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
    /**
     * Used to determine event sorting. Can remove.
     */
    areDatesEqual(date: CurrentCalendarData, date2: CurrentCalendarData) {
        if (date.day != date2.day) return false;
        if (
            date.month != date2.month &&
            date.month != undefined &&
            date2.month != undefined
        )
            return false;
        if (
            date.year != date2.year &&
            date.year != undefined &&
            date2.year != undefined
        )
            return false;
        return true;
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

        //note: added 1 here to fix gregorian offset??
        //TODO: Figure out why.

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
     *
     * TODO: This seems to be a little off? +/- 1 day in Gregorian?
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
