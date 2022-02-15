import type { Calendar } from "../src/@types";
import { PRESET_CALENDARS } from "../src/utils/presets";

const GREGORIAN = PRESET_CALENDARS.find((p) => p.name == "Gregorian Calendar");
const GOLARION = PRESET_CALENDARS.find((p) => p.name == "Calendar of Golarion");
const HARPTOS = PRESET_CALENDARS.find((p) => p.name == "Calendar of Harptos");

test("Leap Days (Gregorian)", () => {
    expect(leapDaysBeforeYear(1, GREGORIAN)).toBe(0);
    expect(leapDaysBeforeYear(5, GREGORIAN)).toBe(1);
    expect(leapDaysBeforeYear(9, GREGORIAN)).toBe(2);
    expect(leapDaysBeforeYear(100, GREGORIAN)).toBe(24);
    expect(leapDaysBeforeYear(401, GREGORIAN)).toBe(97);
    expect(leapDaysBeforeYear(2022, GREGORIAN)).toBe(490);
});
test("Leap Days (Golarion)", () => {
    expect(leapDaysBeforeYear(1, GOLARION)).toBe(0);
    expect(leapDaysBeforeYear(5, GOLARION)).toBe(0);
    expect(leapDaysBeforeYear(9, GOLARION)).toBe(1);
    expect(leapDaysBeforeYear(100, GOLARION)).toBe(12);
    expect(leapDaysBeforeYear(401, GOLARION)).toBe(50);
    expect(leapDaysBeforeYear(2022, GOLARION)).toBe(252);
});
test("Leap Days (Harptos)", () => {
    expect(leapDaysBeforeYear(1, HARPTOS)).toBe(0);
    expect(leapDaysBeforeYear(5, HARPTOS)).toBe(1);
    expect(leapDaysBeforeYear(9, HARPTOS)).toBe(2);
    expect(leapDaysBeforeYear(100, HARPTOS)).toBe(24);
    expect(leapDaysBeforeYear(401, HARPTOS)).toBe(100);
    expect(leapDaysBeforeYear(2022, HARPTOS)).toBe(505);
});

function leapDaysBeforeYear(tester: number, calendar: Calendar) {
    /** If we're checking year 1, there are no leap days. */
    if (tester == 1) return 0;
    /** Subtract 1 from tester. */
    const year = tester - 1;
    let total = 0;
    /** Iterate over each leap day. */
    for (const { interval, offset } of calendar.static.leapDays) {
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
                    Math.floor((year + (c.ignore ? 0 : offset)) / c.interval)
                )
                .reduce((a, b) => a + b, 0);
            /** Calculate how many days match this rule. */
            const calc = Math.floor(
                (year + (condition.ignore ? 0 : offset)) / condition.interval
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
