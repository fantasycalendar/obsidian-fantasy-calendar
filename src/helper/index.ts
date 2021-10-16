import { Events, Notice } from "obsidian";
import type FantasyCalendar from "src/main";
import { MOON_PHASES, Phase } from "src/utils/constants";
import { dateString } from "src/utils/functions";
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
    leapDays: LeapDay[] = [];
    get name() {
        return this.data.name;
    }
    get length() {
        return this.days.length;
    }

    /** Days before this month in the year.  */
    get daysBefore() {
        return this.calendar.daysBeforeMonth(this);
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

    constructor(
        public data: Month,
        public number: number,
        public year: number,
        public calendar: CalendarHelper
    ) {
        this.leapDays = this.calendar.leapDaysForMonth(this);
        this.days = [
            ...new Array(data.length + this.leapDays.length).keys()
        ].map((k) => new DayHelper(this, k + 1));
    }
}

export class DayHelper {
    get calendar() {
        return this.month.calendar;
    }
    get date() {
        return {
            day: this.number,
            month: this.month.number,
            year: this.calendar.displayed.year
        };
    }
    get events(): Event[] {
        return this.calendar.getEventsOnDate(this.date);
    }
    get longDate() {
        return {
            day: this.number,
            month: this.month.name,
            year: this.calendar.displayed.year
        };
    }
    /** Days before this day in the year. */
    get daysBefore() {
        return this.month.daysBefore + this.number - 1;
    }
    get weekday() {
        const firstOfYear = this.calendar.firstDayOfYear();

        return wrap(
            (this.daysBefore % this.calendar.weekdays.length) + firstOfYear,
            this.calendar.weekdays.length
        );
    }
    get isCurrentDay() {
        return (
            this.number == this.calendar.current.day &&
            this.month.number == this.calendar.current.month &&
            this.calendar.displayed.year == this.calendar.current.year
        );
    }
    get isDisplaying() {
        return (
            this.number == this.calendar.viewing.day &&
            this.calendar.displayed.year == this.calendar.viewing.year &&
            this.calendar.displayed.month == this.calendar.viewing.month
        );
    }

    get moons() {
        return this.calendar.getMoonsForDate(this.date);
    }

    constructor(public month: MonthHelper, public number: number) {}
}

export default class CalendarHelper extends Events {
    months: MonthHelper[];
    constructor(public object: Calendar, public plugin: FantasyCalendar) {
        super();
        this.displayed = { ...this.current };
        this.months = this.data.months.map(
            (m, i) => new MonthHelper(m, i, this.displayed.year, this)
        );
    }
    update(calendar: Calendar) {
        this.object = calendar;
        this.months = this.data.months.map(
            (m, i) => new MonthHelper(m, i, this.displayed.year, this)
        );
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
        return this.object.events.filter((e) => {
            return (
                e.date.day == date.day &&
                (e.date.month == undefined || e.date.month == date.month) &&
                (e.date.year == undefined || e.date.year == date.year)
            );
        });
    }

    get currentDate() {
        return dateString(
            this.current,
            this.months.map((m) => m.data)
        );
    }

    get displayedDate() {
        return dateString(
            this.displayed,
            this.months.map((m) => m.data)
        );
    }
    get viewedDate() {
        return dateString(
            this.viewing,
            this.months.map((m) => m.data)
        );
    }

    reset() {
        this.displayed = { ...this.current };

        this.trigger("month-update");
        this.trigger("day-update");
    }

    setCurrentMonth(n: number) {
        this.displayed.month = n;

        this.trigger("month-update");
    }

    goToNextDay() {
        this.viewing.day += 1;
        const currentMonth = this.months[this.displayed.month];
        if (this.viewing.day >= currentMonth.days.length) {
            this.goToNext();
            this.viewing.month = this.displayed.month;
            this.viewing.year = this.displayed.year;
            this.viewing.day = 1;
        }
        this.trigger("day-update");
    }
    goToNextCurrentDay() {
        this.current.day += 1;
        const currentMonth = this.months[this.current.month];
        if (this.current.day >= currentMonth.days.length) {
            this.current.day = 1;
            this.current.month += 1;
            if (this.current.month >= this.months.length) {
                this.current.month = 0;
                this.current.year += 1;
            }
        }
        this.trigger("day-update");
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

    get nextMonthIndex() {
        return wrap(this.displayed.month + 1, this.months.length);
    }
    get nextMonth() {
        return this.months[this.nextMonthIndex];
    }
    goToNext() {
        if (this.nextMonthIndex < this.displayed.month) {
            this.goToNextYear();
        }
        this.setCurrentMonth(this.nextMonthIndex);
    }
    goToNextYear() {
        this.displayed.year += 1;
        this.months = this.data.months.map(
            (m, i) => new MonthHelper(m, i, this.displayed.year, this)
        );
        this.trigger("year-update");
    }
    get prevMonthIndex() {
        return wrap(this.displayed.month - 1, this.months.length);
    }
    get previousMonth() {
        return this.months[this.prevMonthIndex];
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
    goToPreviousYear() {
        this.displayed.year -= 1;
        this.months = this.data.months.map(
            (m, i) => new MonthHelper(m, i, this.displayed.year, this)
        );
        this.trigger("year-update");
    }
    get weekdays() {
        return this.data.weekdays;
    }
    get currentMonth() {
        return this.months[this.displayed.month];
    }
    get daysOfCurrentMonth() {
        return this.currentMonth.days;
    }

    leapDaysForYear(year: number) {
        return this.leapdays.filter((l) => {
            return l.interval
                .sort((a, b) => a.interval - b.interval)
                .some(({ interval, exclusive }, index, array) => {
                    if (exclusive && index == 0) {
                        return year % interval != 0;
                    }

                    if (exclusive) return;

                    if (array[index + 1] && array[index + 1].exclusive) {
                        return (
                            year % interval == 0 &&
                            year % array[index + 1].interval != 0
                        );
                    }
                    return year % interval == 0;
                });
        });
    }

    leapDaysForMonth(month: MonthHelper) {
        return this.leapdays
            .filter((l) => l.timespan == month.number)
            .filter((l) => {
                return l.interval
                    .sort((a, b) => a.interval - b.interval)
                    .some(({ interval, exclusive }, index, array) => {
                        if (exclusive && index == 0) {
                            return this.displayed.year % interval != 0;
                        }

                        if (exclusive) return;

                        if (array[index + 1] && array[index + 1].exclusive) {
                            return (
                                this.displayed.year % interval == 0 &&
                                this.displayed.year %
                                    array[index + 1].interval !=
                                    0
                            );
                        }
                        return this.displayed.year % interval == 0;
                    });
            });
    }

    get fullMonths() {
        return this.months.filter((m) => m.type == "month");
    }

    getPaddedDaysForMonth(month: MonthHelper) {
        let current = month.days;

        /** Get Days of Previous Month */
        let previous: DayHelper[] = [];
        const previousMonthIndex = wrap(
            this.fullMonths.indexOf(month) - 1,
            this.fullMonths.length
        );
        const previousMonth = this.fullMonths[previousMonthIndex];
        if (month.firstWeekday > 0) {
            previous = previousMonth.days.slice(-month.firstWeekday);
        }

        /** Get Days of Next Month */
        let next: DayHelper[] = [];
        const nextMonthIndex = wrap(
            this.fullMonths.indexOf(month) - 1,
            this.fullMonths.length
        );
        const nextMonth = this.fullMonths[nextMonthIndex];
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
            this.data.months[this.displayed.month].length /
                this.data.weekdays.length
        );
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
    daysBeforeMonth(month: MonthHelper, all: boolean = false) {
        if (this.months.indexOf(month) == 0) {
            return 0;
        }
        const months = all
            ? this.months
            : this.months.filter((m) => m.type == "month");

        return months
            .slice(0, months.indexOf(month))
            .reduce((a, b) => a + b.length, 0);
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
        return [...Array(this.displayed.year - 1).keys()]
            .map((k) => this.leapDaysForYear(k + 1))
            .reduce((a, b) => a + b.length, 0);
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
    totalDaysBeforeYear(year: number) {
        if (year < 1) return 0;
        return (
            Math.abs(year - 1) *
                this.data.months.reduce((a, b) => a + b.length, 0) +
            this.leapDaysBefore
        );
    }

    firstDayOfYear() {
        if (!this.data.overflow) return 0;
        if (this.displayed.year == 1) return this.firstWeekday;

        //note: added 1 here to fix gregorian offset??
        return wrap(
            (this.totalDaysBefore % this.data.weekdays.length) +
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
        const month = this.months[date.month];

        const months = this.months.slice(0, this.months.indexOf(month));

        const day = month.days[date.day - 1];
        const daysBefore =
            this.totalDaysBeforeYear(date.year) +
            this.daysBeforeMonth(month, true) +
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
}

export function wrap(value: number, size: number): number {
    return ((value % size) + size) % size;
}
