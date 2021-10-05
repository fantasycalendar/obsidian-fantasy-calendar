import { Events } from "obsidian";
import type { Calendar, CurrentCalendarData, Month } from "../@types";

export default class CalendarHelper extends Events {
    constructor(public object: Calendar) {
        super();
        window.calendar = this;
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
    get months() {
        return this.data.months;
    }
    get weekdays() {
        return this.data.weekdays;
    }
    get currentMonth() {
        return this.months[this.current.month];
    }
    get daysOfCurrentMonth() {
        return [...Array(this.currentMonth.length).keys()].map((k) => k + 1);
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
        return (
            this.daysBeforeMonth(this.months[this.months.length - 1]) +
            this.months[this.months.length - 1].length
        );
    }
    daysBeforeMonth(month: Month) {
        const index = this.data.months.indexOf(month);

        return this.data.months
            .slice(0, index)
            .reduce((a, b) => a + b.length, 0);
    }
    firstDayOfMonth(month: Month) {
        if (!this.data.overflow) return this.data.weekdays[0];

        const days = this.daysBeforeMonth(month);
        const firstOfYear = this.firstDayOfYear();

        return this.data.weekdays[
            this.wrap(
                (days % this.data.weekdays.length) + firstOfYear,
                this.data.weekdays.length
            )
        ];
    }

    firstDayOfYear() {
        if (this.current.year == 1) return this.data.firstWeekDay;

        return this.wrap(
            ((Math.abs(this.current.year - 1) * this.daysPerYear) %
                this.data.weekdays.length) +
                this.data.firstWeekDay,
            this.data.weekdays.length
        );
    }
    wrap(value: number, size: number): number {
        return ((value % size) + size) % size;
    }
}
