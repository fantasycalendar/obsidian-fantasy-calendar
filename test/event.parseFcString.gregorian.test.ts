import { FcEventHelper, ParseDate } from "../src/helper/event.helper";
import { PRESET_CALENDARS } from "../src/utils/presets";

const GREGORIAN = PRESET_CALENDARS.find((p) => p.name == "Gregorian Calendar");
const helper = new FcEventHelper(GREGORIAN, false, 'YYYY-MM-DD');
const file = {
    path: "path",
    basename: "basename"
}

// test("Leap Days (Gregorian)", () => {
//     expect(leapDaysBeforeYear(1, GREGORIAN)).toBe(0);
//     expect(leapDaysBeforeYear(5, GREGORIAN)).toBe(1);
//     expect(leapDaysBeforeYear(9, GREGORIAN)).toBe(2);
//     expect(leapDaysBeforeYear(100, GREGORIAN)).toBe(24);
//     expect(leapDaysBeforeYear(401, GREGORIAN)).toBe(97);
//     expect(leapDaysBeforeYear(2022, GREGORIAN)).toBe(490);
// });

test("Parse January", () => {
    const expected: ParseDate = {
        year: 0,
        month: 0,
        day: 1,
        order: ''
    };
    // Mess around with year 0 for fun
    expect(helper.parseFcDateString("0", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-01-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-Jan", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-January-01", file)).toEqual(expected);
});
test("Parse February", () => {
    const expected: ParseDate = {
        year: 0,
        month: 1,
        day: 1,
        order: ''
    };
    expect(helper.parseFcDateString("0-02", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-02-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-Feb", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-February-01", file)).toEqual(expected);
    // brought into range
    expect(helper.parseFcDateString("0-02-00", file)).toEqual(expected);
    // Bad day
    expect(helper.parseFcDateString("1900-Feb-30", file)).toBeNull();
});
test("Parse February: Leap year", () => {
    const expected: ParseDate = {
        year: 0,
        month: 1,
        day: 29,
        order: ''
    };

    // Leap years
    expect(helper.parseFcDateString("1996-February-29", file)).toEqual({
        ...expected,
        year: 1996
    });
    expect(helper.parseFcDateString("1600-February-29", file)).toEqual({
        ...expected,
        year: 1600
    });
    expect(helper.parseFcDateString("2000-February-29", file)).toEqual({
        ...expected,
        year: 2000
    });
    // Not leap years
    expect(helper.parseFcDateString("1700-Feb-29", file)).toBeNull();
    expect(helper.parseFcDateString("1800-Feb-29", file)).toBeNull();
    expect(helper.parseFcDateString("1900-Feb-29", file)).toBeNull();
});
test("Parse March", () => {
    const expected: ParseDate = {
        year: 0,
        month: 2,
        day: 31,
        order: 'some extra'
    };
    // Mess around with year 0 for fun
    expect(helper.parseFcDateString("0-03-31-some extra", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-Mar-31-some extra", file)).toEqual(expected);
    expect(helper.parseFcDateString("0-March-31-some extra", file)).toEqual(expected);
});