import { Events, Notice } from "obsidian";
import type { Calendar, Month } from "../@types";

export class MonthHelper {
    days: DayHelper[] = [];
    get name() {
        return this.data.name;
    }

    get daysBefore() {
        return this.calendar.daysBeforeMonth(this);
    }

    get firstWeekday() {
        return this.days[0].weekday;
    }
    get lastWeekday() {
        return this.days[this.days.length - 1].weekday;
    }

    constructor(
        public data: Month,
        public number: number,
        public calendar: CalendarHelper
    ) {
        this.days = [...new Array(data.length).keys()].map(
            (k) => new DayHelper(this, k + 1)
        );
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
            year: this.calendar.current.year
        };
    }
    get events() {
        return this.calendar.object.events.filter((e) => {
            return (
                e.date.day == this.date.day &&
                (!e.date.month || e.date.month == this.date.month) &&
                (!e.date.year || e.date.year == this.date.year)
            );
        });
    }
    get longDate() {
        return {
            day: this.number,
            month: this.month.name,
            year: this.calendar.current.year
        };
    }
    get weekday() {
        if (!this.calendar.data.overflow) return 0;

        const days = this.month.daysBefore + this.number - 1;
        const firstOfYear = this.calendar.firstDayOfYear();
        return wrap(
            (days % this.calendar.weekdays.length) + firstOfYear,
            this.calendar.weekdays.length
        );
    }
    get isCurrentDay() {
        return 
    }
    constructor(public month: MonthHelper, public number: number) {}
}

class YearHelper {
    constructor(public year: Number) {}
}

export default class CalendarHelper extends Events {
    months: MonthHelper[];
    constructor(public object: Calendar) {
        super();
        window.calendar = this;

        this.months = this.data.months.map(
            (m, i) => new MonthHelper(m, i + 1, this)
        );
    }
    get data() {
        return this.object.static;
    }
    get current() {
        return this.object.current;
    }
    setCurrentMonth(n: number) {
        this.object.current.month = n;

        this.trigger("month-update");
    }
    get nextMonthIndex() {
        return wrap(this.current.month + 1, this.months.length);
    }
    get nextMonth() {
        return this.months[this.nextMonthIndex];
    }
    goToNext() {
        if (this.nextMonthIndex < this.current.month) {
            this.current.year += 1;
        }
        this.setCurrentMonth(this.nextMonthIndex);
    }
    get prevMonthIndex() {
        return wrap(this.current.month - 1, this.months.length);
    }
    get previousMonth() {
        return this.months[this.prevMonthIndex];
    }
    goToPrevious() {
        if (this.prevMonthIndex > this.current.month) {
            if (this.current.year == 1) {
                new Notice("This is the earliest year.");
                return;
            }
            this.current.year -= 1;
        }
        this.setCurrentMonth(this.prevMonthIndex);
    }

    get weekdays() {
        return this.data.weekdays;
    }
    get currentMonth() {
        return this.months[this.current.month];
    }
    get daysOfCurrentMonth() {
        return this.currentMonth.days;
    }
    get paddedDays() {
        let previous: DayHelper[] = [];
        let current = this.daysOfCurrentMonth;
        let next: DayHelper[] = [];

        /** Get Days of Previous Month */
        if (this.currentMonth.firstWeekday > 0) {
            previous = this.previousMonth.days.slice(
                -this.currentMonth.firstWeekday
            );
        }

        /** Get Days of Next Month */
        if (this.currentMonth.lastWeekday < this.weekdays.length) {
            next = this.nextMonth.days.slice(
                0,
                this.weekdays.length - this.currentMonth.lastWeekday - 1
            );
        }

        return {
            previous,
            current,
            next
        };
    }

    /**
     *
     * Returns the rounded up number of weeks of the current month. Use to build calendar rows.
     * @readonly
     * @memberof Calendar
     */
    get weeksPerCurrentMonth() {
        return Math.ceil(
            this.data.months[this.current.month].length /
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
        return this.months.reduce((a, b) => a + b.days.length, 0);
    }
    daysBeforeMonth(month: MonthHelper) {
        return this.months
            .slice(0, month.number)
            .reduce((a, b) => a + b.days.length, 0);
    }

    firstDayOfYear() {
        if (this.current.year == 1) return this.data.firstWeekDay;

        return wrap(
            ((Math.abs(this.current.year - 1) * this.daysPerYear) %
                this.data.weekdays.length) +
                this.data.firstWeekDay,
            this.data.weekdays.length
        );
    }
}

export function wrap(value: number, size: number): number {
    return ((value % size) + size) % size;
}
