import { LeapDay } from "../src/@types/calendar";
import { FcEventHelper, ParseDate } from "../src/helper/event.helper";
import { PRESET_CALENDARS } from "../src/utils/presets";

const HARPTOS = PRESET_CALENDARS.find((p) => p.name == "Calendar of Harptos");
const helper = new FcEventHelper(HARPTOS, false, 'YYYY-MM-DD');
const file = {
    path: "path",
    basename: "basename"
}

// index | fc-date | calendar reckoning | Month name
//  0 |  1 |  1 | Hammer
//  1 |  2 |  - | Midwinter
//  2 |  3 |  2 | Alturiak
//  3 |  4 |  3 | Ches
//  4 |  5 |  4 | Tarsakh
//  5 |  6 |  - | Greengrass
//  6 |  7 |  5 | Mirtul
//  7 |  8 |  6 | Kythorn
//  8 |  9 |  7 | Flamerule
//  9 | 10 |  - | Midsummer (Shieldmeet)
// 10 | 11 |  8 | Elesias
// 11 | 12 |  9 | Eleint
// 12 | 13 |  - | Highharvestide
// 13 | 14 | 10 | Marpenoth
// 14 | 15 | 11 | Uktar
// 15 | 16 |  - | Feast of the Moon
// 16 | 17 | 12 | Nightal

test("daysForMonth", () => {
    expect(helper.daysForMonth(0,  1499)).toEqual(30);
    expect(helper.daysForMonth(1,  1499)).toEqual(1);
    expect(helper.daysForMonth(5,  1499)).toEqual(1);
    expect(helper.daysForMonth(9,  1499)).toEqual(1);
    expect(helper.daysForMonth(9,  1372)).toEqual(2);
    expect(helper.daysForMonth(12, 1499)).toEqual(1);
    expect(helper.daysForMonth(16, 1499)).toEqual(30);
});

//  0 |  1 |  1 | Hammer
test("Parse Harptos: 1499-01, Hammer", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 0,
        day: 1,
        order: ''
    };
    expect(helper.parseFcDateString("1499", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-01-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Hammer", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Hammer-01", file)).toEqual(expected);
});
//  1 |  2 |  - | Midwinter
test("Parse Harptos: 1499-02, Midwinter", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 1, // Midwinter
        day: 1,
        order: ''
    };
    expect(helper.parseFcDateString("1499-02", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-02-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Midwinter", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Midwinter-01", file)).toEqual(expected);
    // Midwinter has only one day...
    expect(helper.parseFcDateString("1499-02-03", file)).toBeNull();
});
//  2 |  3 |  2 | Alturiak
test("Parse Harptos: 1499-03, Alturiak", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 2, // month numbers line up for Alturiak (2), Ches (3), Tarsahk (4)
        day: 1,
        order: ''
    };
    expect(helper.parseFcDateString("1499-03", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-03-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Alturiak", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Alturiak-01", file)).toEqual(expected);
});
//  3 |  4 |  3 | Ches
//  4 |  5 |  4 | Tarsakh
//  5 |  6 |  - | Greengrass
test("Parse Harptos: 1499-06, Greengrass", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 5, // Greengrass
        day: 1,
        order: ''
    }
    expect(helper.parseFcDateString("1499-06", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-06-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Greengrass", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Greengrass-01", file)).toEqual(expected);
    // Greengrass has only one day...
    expect(helper.parseFcDateString("1499-06-03", file)).toBeNull();
});
//  6 |  7 |  5 | Mirtul
test("Parse Harptos: 1499-06, Mirtul", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 6,
        day: 1,
        order: ''
    }
    expect(helper.parseFcDateString("1499-07", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-07-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Mir", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Mirtul-01", file)).toEqual(expected);
});
//  7 |  8 |  6 | Kythorn
//  8 |  9 |  7 | Flamerule
//  9 | 10 |  - | Midsummer (Shieldmeet)
test("Parse Harptos: 1499-09, Midsummer", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 9,
        day: 1,
        order: ''
    }
    expect(helper.parseFcDateString("1499-10", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-10-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Midsum", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Midsummer-01", file)).toEqual(expected);
});
test("Parse Harptos: 1372-Shieldmeet", () => {
    const expected: ParseDate = {
        year: 1372,
        month: 9,
        day: 2,
        order: ''
    }
    expect(helper.parseFcDateString("1372-10-02", file)).toEqual(expected);
    expect(helper.parseFcDateString("1372-Shieldmeet", file)).toEqual(expected);
    expect(helper.parseFcDateString("1372-Shieldmeet-02", file)).toEqual(expected);
    // Shieldmeet is a leapday
    expect(helper.parseFcDateString("1499-10-02", file)).toBeNull();

});
// 10 | 11 |  8 | Eleasis
test("Parse Harptos: 1499-11, Eleasis", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 10,
        day: 1,
        order: ''
    }
    expect(helper.parseFcDateString("1499-11", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-11-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Eleas", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Eleasis-01", file)).toEqual(expected);
});
// 11 | 12 |  9 | Eleint
// 12 | 13 |  - | Highharvestide
test("Parse Harptos: 1499-13, Highharvestide", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 12,
        day: 1,
        order: ''
    }
    expect(helper.parseFcDateString("1499-13", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-13-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-High", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Highharvestide-01", file)).toEqual(expected);
});
// 13 | 14 | 10 | Marpenoth
test("Parse Harptos: 1499-14, Marpenoth", () => {
    const expected: ParseDate = {
        year: 1499,
        month: 13,
        day: 1,
        order: ''
    }
    expect(helper.parseFcDateString("1499-14", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-14-01", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Marp", file)).toEqual(expected);
    expect(helper.parseFcDateString("1499-Marpenoth-01", file)).toEqual(expected);
});
// 14 | 15 | 11 | Uktar
// 15 | 16 |  - | Feast of the Moon
// 16 | 17 | 12 | Nightal