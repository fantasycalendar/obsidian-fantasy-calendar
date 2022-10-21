import { Notice } from "obsidian";
import type {
    Calendar,
    CurrentCalendarData,
    EventCategory,
    Moon,
    Phase
} from "src/@types";
import type APIDefinition from "src/@types/api";
import type { Day } from "src/@types/api";
import CalendarHelper from "src/helper";
import FantasyCalendar from "src/main";
import { dateString, nanoid } from "src/utils/functions";

import MoonUI from "../view/ui/Moon.svelte";

export class API implements APIDefinition {
    constructor(private plugin: FantasyCalendar) {}
    getCalendars() {
        return this.plugin.data.calendars;
    }
    getMoons(date?: CurrentCalendarData, name?: string) {
        const calendar = name
            ? this.plugin.data.calendars.find(
                  ({ name: c_name }) => c_name == name
              )
            : this.plugin.defaultCalendar ?? this.plugin.defaultCalendar;
        const helper = this.getHelper(calendar);

        const dateToGet = date ? date : helper.current;

        const day = helper.getDayForDate(dateToGet);

        let moons: Array<{ icon: HTMLSpanElement; moon: Moon; phase: Phase }> =
            [];
        for (const [moon, phase] of day.moons) {
            const target = createSpan();
            new MoonUI({
                target,
                props: {
                    moon,
                    phase
                }
            });
            moons.push({ icon: target, moon, phase });
        }
        return moons;
    }
    getDay(
        date: { year: number; month: string; day: number },
        calendar: Calendar | string
    ): Day;
    getDay(
        date: { year: number; month: number; day: number },
        calendar: Calendar | string
    ): Day;
    getDay(
        date: { year: number; month: number | string; day: number },
        calendar: Calendar | string = this.plugin.defaultCalendar
    ): Day {
        if (
            !date ||
            typeof date != "object" ||
            date.year == null ||
            date.month == null ||
            date.day == null
        ) {
            new Notice(
                "The Date parameter is required and must have the day, month and year."
            );
            return;
        }
        if (typeof calendar == "string") {
            calendar =
                this.plugin.data.calendars.find((c) => c.name == calendar) ??
                this.plugin.defaultCalendar;
        }
        const helper = this.getHelper(calendar);
        let month;
        if (typeof date.month == "string") {
            month = helper.data.months.findIndex((m) => {
                return m.name == date.month;
            });
        } else {
            month = date.month;
        }
        if (
            isNaN(date.year) ||
            isNaN(month) ||
            month == -1 ||
            isNaN(date.day)
        ) {
            let secondMessage = [];
            if (isNaN(date.year)) {
                secondMessage.push("The year must be a number.");
            }
            if (isNaN(month) || month == -1) {
                if (typeof date.month == "string") {
                    secondMessage.push(
                        `Could not find ${date.month} in the Months list for ${helper.calendar.name}`
                    );
                } else {
                    secondMessage.push(
                        `The month must be a number or the name of a month in the list of months for the selected calendar.`
                    );
                }
            }
            if (isNaN(date.day)) {
                secondMessage.push("The year must be a number.");
            }
            new Notice(
                `There was an issue with the provided date.\n\n${secondMessage.join(
                    "\n"
                )}`
            );
            return;
        }
        const day = helper.getDayForDate({
            year: date.year,
            month,
            day: date.day
        });
        return {
            moons: day.moons,
            events: day.events,
            date: day.date,
            longDate: day.longDate,
            leapDay: day.leapday,
            weekday: day.weekday,
            displayDate: dateString(day.date, helper.data.months)
        };
    }

    async addCategoryToCalendar(
        category: EventCategory,
        calendar: Calendar | string = this.plugin.defaultCalendar
    ) {
        if (!category) {
            throw new Error("Category is required.");
        }
        if (!category.name || !category.color) {
            throw new Error("A category requires a name and a color.");
        }
        if (!category.id) {
            category.id = nanoid(6);
        }
        if (typeof calendar == "string") {
            calendar =
                this.plugin.data.calendars.find((c) => c.name == calendar) ??
                this.plugin.defaultCalendar;
        }

        if (
            !calendar ||
            typeof calendar != "object" ||
            !("categories" in calendar)
        ) {
            throw new Error("Invalid calendar provided.");
        }

        calendar.categories.push(category);

        await this.plugin.saveCalendar();
    }
    getHelper(calendar = this.plugin.defaultCalendar) {
        return new CalendarHelper(calendar, this.plugin);
    }
}
