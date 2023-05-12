import { Calendar } from "../src/@types";
import {
    daysBeforeYear,
    getFirstDayOfYear,
} from "../src/stores/calculator/years.store";
import { PRESET_CALENDARS } from "../src/utils/presets";

const GREGORIAN: Calendar = PRESET_CALENDARS.find(
    (p) => p.name == "Gregorian Calendar"
);

test("Days Before Year (Gregorian)", () => {
    expect(
        daysBeforeYear(1, GREGORIAN.static.months, GREGORIAN.static.leapDays)
    ).toBe(0);
    expect(
        daysBeforeYear(2, GREGORIAN.static.months, GREGORIAN.static.leapDays)
    ).toBe(365);
    expect(
        daysBeforeYear(5, GREGORIAN.static.months, GREGORIAN.static.leapDays)
    ).toBe(365 * 4 + 1);
    expect(
        daysBeforeYear(20, GREGORIAN.static.months, GREGORIAN.static.leapDays)
    ).toBe(365 * 19 + 4);
});

test("First Weekday (Gregorian)", () => {
    expect(
        getFirstDayOfYear(
            2023,
            GREGORIAN.static.months,
            GREGORIAN.static.weekdays,
            GREGORIAN.static.leapDays,
            GREGORIAN.static.overflow,
            GREGORIAN.static.firstWeekDay,
            GREGORIAN.static.offset
        )
    ).toBe(0);
});
