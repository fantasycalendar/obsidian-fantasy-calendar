import { Events, Notice } from "obsidian";
import type FantasyCalendar from "src/main";
import { MOON_PHASES, Phase } from "src/utils/constants";
import { dateString, wrap } from "src/utils/functions";
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
    moons: Array<[Moon, Phase]>;
    getMoonsForDay(day: CurrentCalendarData) {
        if (!this.moons || !this.moons.length || this.shouldUpdateMoons) {
            this.moons = this.calendar.getMoonsForMonth(this);
        }
        return this.moons;
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
            ...new Array(data.length + this.leapDays.length).keys()
        ].map((k) => new DayHelper(this, k + 1));
    }
}

export class DayHelper {
    private _events: Event[];
    shouldUpdateEvents: boolean;
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
        if (!this._events || !this._events.length || this.shouldUpdateEvents) {
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
        return this.month.daysBefore + this.number - 1;
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

    shouldUpdateMoons = false;
    private _moons: Array<[Moon, Phase]>;
    get moons() {
        if (!this._moons || !this._moons.length || this.shouldUpdateMoons) {
            this._moons = this.month.getMoonsForDay(this.date);
        }
        return this._moons;
    }

    constructor(public month: MonthHelper, public number: number) {}
}

export default class CalendarHelper extends Events {
    eventsForMonth(helper: MonthHelper): Event[] {
        //get from cache first

        //else
        const { year, number: month } = helper;
        const events = this.object.events.filter((event) => {
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
    maxDays: number;
    get displayWeeks() {
        return this.object.displayWeeks;
    }
    constructor(public object: Calendar, public plugin: FantasyCalendar) {
        super();
        this.displayed = { ...this.current };
        this.update(this.object);

        //TODO: Tell existing months / days to update.
        this.plugin.registerEvent(
            this.plugin.app.workspace.on(
                "fantasy-calendars-event-update",
                (calendar, event, original) => {
                    console.log(
                        "🚀 ~ file: index.ts ~ line 200 ~ event",
                        event
                    );

                    if (calendar != this.object.id) return;
                    if (!event) return;
                    if (!event.date) return;
                }
            )
        );

        /* window.calendar = this; */
    }

    _cache: Map<number, Map<number, MonthHelper>> = new Map();

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
    hash(date: CurrentCalendarData) {
        if (date.year == null || date.month == null || date.day == null)
            return null;
        const months = `${this.data.months.length}`.length;
        const month = `${date.month}`.padStart(months, "0");
        const days = `${this.maxDays}`.length;
        const day = `${date.day}`.padStart(days, "0");
        return `${date.year}${month}${day}`;
    }
    map: Map<string, Set<string>> = new Map();
    invMap: Map<string, Set<string>> = new Map();
    isEqual(date: CurrentCalendarData, next: CurrentCalendarData) {
        return (
            date?.year == next?.year &&
            date?.month == next?.month &&
            date?.day == next?.day
        );
    }
    update(calendar?: Calendar) {
        this.object = calendar ?? this.object;
        this.maxDays = Math.max(...this.data.months.map((m) => m.length));

        this.trigger("month-update");
        this.trigger("day-update");
    }
    get data() {
        return this.object.static;
    }
    get current() {
        return this.object.current;
    }

    get leapdays() {
        return this.data.leapDays;
    }

    displayed: CurrentCalendarData = {
        year: null,
        month: null,
        day: null
    };

    viewing: CurrentCalendarData = {
        year: null,
        month: null,
        day: null
    };
    getEventsOnDate(date: CurrentCalendarData) {
        //this is being called multiple times why
        if (this.map && this.map.size) {
            const hash = this.hash(date);
            const set = this.map.get(hash) ?? new Set();
            if (!set.size) return [];
            const events = this.object.events.filter((e) => set.has(e.id));
            return [...events].sort((a, b) => {
                if (!a.end) return 0;
                if (!b.end) return -1;
                if (this.areDatesEqual(a.date, b.date)) {
                    return (
                        this.daysBeforeDate(b.end) - this.daysBeforeDate(a.end)
                    );
                }
                return (
                    this.daysBeforeDate(a.date) - this.daysBeforeDate(b.date)
                );
            });
        }
        const events = this.object.events.filter((e) => {
            if (!e.date.day) return false;
            if (!e.end) {
                e.end = { ...e.date };
            }
            const start = { ...e.date };
            if (start.year > date.year) return false;
            const end = { ...e.end };
            if (start.month == undefined) end.month = start.month = date.month;
            if (start.year == undefined) end.year = start.year = date.year;

            const daysBeforeStart = this.daysBeforeDate(start);
            const daysBeforeDate = this.daysBeforeDate(date);
            if (end.year > date.year) {
                return daysBeforeDate >= daysBeforeStart;
            }

            const daysBeforeEnd = this.daysBeforeDate(end);
            return (
                daysBeforeDate >= daysBeforeStart &&
                daysBeforeEnd >= daysBeforeDate
            );
        });

        events.sort((a, b) => {
            if (!a.end) return 0;
            if (!b.end) return -1;
            if (this.areDatesEqual(a.date, b.date)) {
                return this.daysBeforeDate(b.end) - this.daysBeforeDate(a.end);
            }
            return this.daysBeforeDate(a.date) - this.daysBeforeDate(b.date);
        });

        return events;
    }

    get currentDate() {
        return dateString(this.current, this.data.months);
    }

    get displayedDate() {
        return dateString(this.displayed, this.data.months);
    }
    get viewedDate() {
        return dateString(this.viewing, this.data.months);
    }

    reset() {
        this.displayed = { ...this.current };
        this.viewing = { ...this.current };

        this.trigger("month-update");
        this.trigger("day-update");
    }

    setCurrentMonth(n: number) {
        this.displayed.month = n;

        this.trigger("month-update");
    }

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

    get nextMonthIndex() {
        return wrap(this.displayed.month + 1, this.data.months.length);
    }
    get nextMonth() {
        return this.getMonth(this.displayed.month + 1, this.displayed.year);
    }
    canGoToNextYear(year = this.displayed.year) {
        return !this.data.useCustomYears || year < this.data.years.length;
    }
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
    goToNextYear() {
        this.displayed.year += 1;
        this.trigger("year-update");
    }
    get prevMonthIndex() {
        return wrap(this.displayed.month - 1, this.data.months.length);
    }
    get previousMonth() {
        return this.getMonth(this.displayed.month - 1, this.displayed.year);
    }
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
    goToPreviousYear() {
        this.displayed.year -= 1;
        this.trigger("year-update");
    }
    get weekdays() {
        return this.data.weekdays;
    }
    get currentMonth() {
        return this.getMonth(this.displayed.month, this.displayed.year);
    }

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
    leapDaysForYear(year: number) {
        return this.leapdays.filter((l) => {
            return this.testLeapDay(l, year);
        });
    }

    leapDaysForMonth(month: number, year = this.displayed.year) {
        return this.leapdays.filter((l) => {
            if (l.timespan != month) return false;
            return this.testLeapDay(l, year);
        });
    }

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

    getPaddedDaysForMonth(month: MonthHelper) {
        let current = month.days;

        /** Get Days of Previous Month */
        let previous: DayHelper[] = [];

        if (month.firstWeekday > 0 && month.type == "month") {
            const previousMonth = this.getMonth(
                month.index - 1,
                this.displayed.year,
                -1
            );
            previous =
                previousMonth != null
                    ? previousMonth.days.slice(-month.firstWeekday)
                    : Array(month.firstWeekday).fill(null);
        }

        /** Get Days of Next Month */
        let next: DayHelper[] = [];
        if (
            month.lastWeekday < this.weekdays.length - 1 &&
            month.type == "month"
        ) {
            const nextMonth = this.getMonth(
                month.index + 1,
                this.displayed.year,
                1
            );
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

    get paddedDays() {
        return this.getPaddedDaysForMonth(this.currentMonth);
    }

    /**
     *
     * Returns the rounded up number of weeks of the current month. Use to build calendar rows.
     * @readonly
     * @memberof Calendar
     */
    get weeksPerCurrentMonth() {
        return Math.ceil(
            this.getMonth(this.displayed.month, this.displayed.year).length /
                this.data.weekdays.length
        );
    }
    weeksOfMonth(month: MonthHelper) {
        return Math.ceil(
            (month.length + month.firstWeekday) / this.data.weekdays.length
        );
    }
    weekNumbersOfMonth(month: MonthHelper) {
        const daysBefore = month.daysBefore + this.firstDayOfYear(month.year);
        return Math.floor(daysBefore / this.data.weekdays.length);
    }
    /**
     * Total number of days in a year.
     *
     * @readonly
     * @memberof Calendar
     */
    get daysPerYear() {
        return this.data.months
            .filter((m) => m.type === "month")
            .reduce((a, b) => a + b.length, 0);
    }
    daysBeforeMonth(month: number, year: number, all: boolean = false) {
        if (!month || month == 0) return 0;

        return this.data.months
            .slice(0, month)
            .filter((m) => (all ? true : m.type == "month"))
            .map((m, i) => m.length + this.leapDaysForMonth(i, year).length)
            .reduce((a, b) => a + b, 0);
    }

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

    daysBeforeDate(date: CurrentCalendarData) {
        const daysBeforeYear = this.daysBeforeYear(date.year);
        const daysBeforeMonth = this.daysBeforeMonth(
            date.month,
            date.year,
            true
        );
        return daysBeforeYear + daysBeforeMonth + date.day;
    }

    dayNumberForDate(date: CurrentCalendarData) {
        return this.daysBeforeMonth(date.month, date.year, true) + date.day;
    }

    get firstWeekday() {
        return this.data.firstWeekDay;
    }

    /**
     *
     * Total number of leap days that have occured before this year.
     * @readonly
     * @memberof CalendarHelper
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
        /** Subtract 1 from tester. */
        const year = tester - 1;
        let total = 0;
        /** Iterate over each leap day. */
        for (const { interval, offset } of this.leapdays) {
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
    get daysBefore() {
        return this.daysBeforeYear(this.displayed.year);
    }
    get totalDaysBefore() {
        return this.daysBefore + this.leapDaysBefore;
    }

    daysBeforeYear(year: number) {
        if (year < 1) return 0;
        return Math.abs(year - 1) * this.daysPerYear;
    }
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

    firstDayOfYear(year = this.displayed.year) {
        if (!this.data.overflow) return 0;
        if (year == 1) return this.firstWeekday;

        //note: added 1 here to fix gregorian offset??
        return wrap(
            (this.totalDaysBeforeYear(year) % this.data.weekdays.length) +
                this.firstWeekday +
                (this.data.offset ?? 0),
            this.data.weekdays.length
        );
    }

    /** Moons */
    get moons() {
        return this.data.moons;
    }

    getMoonsForDate(date: CurrentCalendarData): Array<[Moon, Phase]> {
        const phases: Array<[Moon, Phase]> = [];

        const month = this.getMonth(date.month, date.year);

        const day = month.days[date.day - 1];

        const daysBefore =
            this.totalDaysBeforeYear(date.year, true) +
            this.daysBeforeMonth(date.month, date.year, true) +
            day.number -
            1;
        for (let moon of this.moons) {
            const { offset, cycle } = moon;
            const granularity = 24;

            let data = (daysBefore - offset) / cycle;
            let position = data - Math.floor(data);

            const phase = (position * granularity) % granularity;

            const options = MOON_PHASES[granularity];

            phases.push([
                moon,
                options[wrap(Math.round(phase), options.length)]
            ]);
        }

        return phases;
    }
    getMoonsForMonth(month: MonthHelper): [Moon, Phase][] {
        const phases: Array<[Moon, Phase]> = [];

        for (const day of month.days) {
            const daysBefore =
                this.totalDaysBeforeYear(month.year, true) +
                this.daysBeforeMonth(month.number, month.year, true) +
                day.number -
                1;
            for (let moon of this.moons) {
                const { offset, cycle } = moon;
                const granularity = 24;

                let data = (daysBefore - offset) / cycle;
                let position = data - Math.floor(data);

                const phase = (position * granularity) % granularity;

                const options = MOON_PHASES[granularity];

                phases.push([
                    moon,
                    options[wrap(Math.round(phase), options.length)]
                ]);
            }
        }

        return phases;
    }
}
