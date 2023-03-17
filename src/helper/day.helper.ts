import { Moon, Phase, LeapDay, Event } from "src/@types";
import { MonthHelper } from "./month.helper";
import { wrap } from "src/utils/functions";

export class DayHelper {
    private _events: Event[];
    shouldUpdate: boolean = false;
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
        if (!this._events || !this._events.length || this.shouldUpdate) {
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
            this.month.year == this.calendar.viewing.year &&
            this.month.number == this.calendar.viewing.month
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
