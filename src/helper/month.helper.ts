import type { LeapDay, FcEvent, FcDate, Moon, Phase, Month } from "src/@types";
import CalendarHelper from ".";
import { DayHelper } from "./day.helper";

export class MonthHelper {
  days: DayHelper[] = [];
  daysBefore: number;
  leapDays: LeapDay[] = [];
  shouldUpdate = false;

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
  events: FcEvent[];
  getEventsOnDay(day: FcDate) {
    if (!this.events || !this.events.length || this.shouldUpdate) {
      this.days.forEach((day) => (day.shouldUpdate = true));
      this.events = this.calendar.getEventsForMonth(this);
      this.shouldUpdate = false;
    }
    return this.events.filter((event) => {
      if (
        (!event.date.year || event.date.year == day.year) &&
        (!event.date.month || event.date.month == day.month) &&
        event.date.day == day.day
      )
        return true;
      if (!event.end && !event.formulas?.length) return false;
      const start = { ...event.date };
      const end = {
        ...(event.end ?? {}),
      };

      if (!start.year) start.year = end.year = this.year;
      if (!start.month) start.month = end.month = this.number;

      const hash = Number(this.calendar.hash(day));
      if (
        Number(this.calendar.hash(start)) <= hash &&
        hash <= Number(this.calendar.hash(end) ?? Infinity)
      ) {
        if (!event.formulas?.length) {
          return true;
        } else {
          const startDays =
            this.calendar.totalDaysBeforeYear(start.year) +
            this.calendar.daysBeforeMonth(start.month, start.year, true) +
            start.day;
          const currentDays =
            this.calendar.totalDaysBeforeYear(day.year) +
            this.calendar.daysBeforeMonth(day.month, day.year, true) +
            day.day;
          const daysBetween = currentDays - startDays;

          return daysBetween % event.formulas[0].number == 0;
        }
      }
      return false;
    });
  }
  shouldUpdateMoons = false;
  moons: Array<[Moon, Phase]>[];
  getMoonsForDay(day: FcDate) {
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
      ).keys(),
    ].map((k) => {
      return new DayHelper(
        this,
        k + 1,
        this.leapDays.find((leapday) => leapday.after == k)
      );
    });
  }
}
