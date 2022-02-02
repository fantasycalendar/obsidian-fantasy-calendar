import { setIcon } from "obsidian";
import type { Calendar } from "src/@types";
import { isValidDay, isValidMonth, isValidYear } from "src/utils/functions";

export function warning(node: HTMLElement) {
    setIcon(node, "fantasy-calendar-warning");
}

export function getMissingNotice(calendar: Calendar) {
    let missingArr: string[] = [];

    if (!calendar.name?.length) {
        missingArr.push("A calendar must have a name.");
    }

    if (
        !isValidDay(calendar.current.day, calendar) ||
        !isValidMonth(calendar.current.month, calendar) ||
        !isValidYear(calendar.current.year, calendar)
    ) {
        missingArr.push("Specified current date is not valid.");
    }
    if (!calendar.static.weekdays?.length) {
        missingArr.push("A calendar must have at least 1 weekday.");
    } else {
        if (!calendar.static.weekdays?.every((d) => d.name?.length)) {
            const length = calendar.static.weekdays?.filter(
                (d) => !d.name?.length
            ).length;
            if (length == 1) {
                missingArr.push(`${length} weekday does not have a name.`);
            } else {
                missingArr.push(`${length} weekdays do not have names.`);
            }
        }
        if (
            calendar.static.firstWeekDay >=
            (calendar.static.weekdays?.length ?? Infinity)
        ) {
            missingArr.push(
                `Invalid first weekday selection: ${
                    calendar.static.weekdays[calendar.static.firstWeekDay]
                }`
            );
        }
    }
    if (!calendar.static.months?.length) {
        missingArr.push("A calendar must have at least 1 month.");
    } else {
        if (!calendar.static.months?.every((m) => m.name?.length)) {
            const length = calendar.static.months?.filter(
                (m) => !m.name?.length
            ).length;
            if (length == 1) {
                missingArr.push(`${length} month does not have a name.`);
            } else {
                missingArr.push(`${length} months do not have names.`);
            }
        }
        if (!calendar.static.months?.every((m) => m.length > 0)) {
            const length = calendar.static.months?.filter(
                (m) => !(m.length > 0)
            ).length;
            if (length == 1) {
                missingArr.push(`${length} month does not have a length.`);
            } else {
                missingArr.push(`${length} months do not have lengths.`);
            }
        }
    }
    if (calendar.static.useCustomYears) {
        if (!calendar.static.years?.length) {
            missingArr.push(
                `Use Custom Years is on but no years have been created.`
            );
        } else if (!calendar.static.years.every((y) => y.name?.length)) {
            const length = calendar.static.years.filter(
                (y) => !y.name?.length
            ).length;
            if (length == 1) {
                missingArr.push(`${length} year does not have a name.`);
            } else {
                missingArr.push(`${length} years do not have names.`);
            }
        }
    }
    return missingArr.join("\n");
}

export function getCanSave(calendar: Calendar) {
    if (
        isValidDay(calendar.current.day, calendar) &&
        isValidMonth(calendar.current.month, calendar) &&
        isValidYear(calendar.current.year, calendar) &&
        calendar.static.months?.length &&
        calendar.static.months?.every((m) => m.name?.length) &&
        calendar.static.months?.every((m) => m.length > 0) &&
        calendar.static.weekdays?.length &&
        calendar.static.weekdays?.every((d) => d.name?.length) &&
        calendar.name?.length &&
        calendar.static.firstWeekDay <
            (calendar.static.weekdays?.length ?? Infinity) &&
        (!calendar.static.useCustomYears ||
            (calendar.static.useCustomYears &&
                calendar.static.years?.length &&
                calendar.static.years.every((y) => y.name?.length)))
    ) {
        return true;
    }
    return false;
}
export function invalidDayLabel(day: number, calendar: Calendar) {
    if (day == null) return "No day specified";
    if (calendar?.current?.month == null) return "No month selected";
    if (
        day < 1 ||
        day > calendar?.static?.months[calendar.current?.month]?.length ||
        !calendar?.static?.months[calendar.current?.month]?.length
    )
        return "Day does not exist in selected month";
}

export function invalidMonthLabel(month: number, calendar: Calendar) {
    if (month == null) return "No month specified";
    if (!calendar?.static?.months?.length) return "No months exist";
    if (month < 0 || month >= calendar?.static?.months?.length)
        return "Selected month does not exist";
}

export function invalidYearLabel(year: number, calendar: Calendar) {
    if (year == null) return "No year specified";
    if (year < 1 && !calendar.static?.useCustomYears) return "Years start at 1";
    if (calendar?.static?.useCustomYears) {
        if (!calendar?.static?.years?.length) return "No custom years exist";
        if (year < 0 || year >= calendar?.static?.years?.length)
            return "Year does not exist in custom years";
    }
}
