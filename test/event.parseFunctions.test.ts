import { Loc, Pos } from "obsidian";
import { FcEvent } from "../src/@types";
import { FcEventHelper, ParseDate } from "../src/helper/event.helper";
import { PRESET_CALENDARS } from "../src/utils/presets";

const GREGORIAN = PRESET_CALENDARS.find((p) => p.name == "Gregorian Calendar");
const gregorian = new FcEventHelper(GREGORIAN, true, 'YYYY-MM-DD');

const file = {
    path: "path",
    basename: "1966-04"
}
const loc: Loc = {
    line: 0,
    col: 0,
    offset: 0
}
const position: Pos = {
    start: loc,
    end: loc
}

test("Bad Year", () => {
    expect(gregorian.parseFcDateString("", file)).toBeNull();
});

test("Timestamp", () => {
    const expected: ParseDate = {
        year: 1966,
        month: 3,
        day: 1,
        order: ''
    };

    expect(gregorian.padDays).toEqual(2);
    expect(gregorian.padMonth).toEqual(2);
    expect(gregorian.parsedToTimestamp(expected)).toEqual({
        timestamp: 19660301,
        order: ''
    })
});

test("parseFrontmatterDate / parseFilename", () => {
    const expected: ParseDate = {
        year: 1966,
        month: 3,
        day: 1,
        order: ''
    };
    // read date string from frontmatter
    expect(gregorian.parseFrontmatterDate("1966-04", file)).toEqual(expected);

    // read date from filename
    expect(gregorian.parseFilenameDate({
        ...file,
        basename: "1966-04"
    })).toEqual(expected);

    // read date from object
    expect(gregorian.parseFrontmatterDate({
            year: 1966,
            month: 4,
            day: 1
        }, file)).toEqual(expected);
});

test("parseFrontmatterDate / parseFilenameDate: extra", () => {
    const expected: ParseDate = {
        year: 1966,
        month: 3,
        day: 1,
        order: '01 some extra flavor'
    };
    // read date string from frontmatter
    expect(gregorian.parseFrontmatterDate(
        "1966-04-01-01 some extra flavor", file)).toEqual(expected);

    // read date from filename
    expect(gregorian.parseFilenameDate({
        ...file,
        basename: "1966-04-01-01 some extra flavor"
    })).toEqual(expected);

    // read date from object
    expect(gregorian.parseFrontmatterDate({
            year: 1966,
            month: 4,
            day: 1,
            order: '01 some extra flavor'
        }, file)).toEqual(expected);
});

test("parseFrontmatterEvent", () => {
    let category = gregorian.calendar.categories[0];
    let actual: FcEvent[] = [];

    gregorian.parseFrontmatterEvent({
            "fc-start": "1966-05-23",
            "fc-end": {
                year: 1966,
                month: 8,
                day: 1
            },
            "fc-display-name": "Pretty name",
            "fc-description": "Fun text",
            "fc-img": "attachments/thing.png",
            position
        }, file,
        (event) => { actual.push(event)},
        category
    );

    expect(actual.length).toEqual(1);
    expect(actual[0].id).toBeDefined();
    expect(actual[0].name).toEqual("Pretty name");
    expect(actual[0].description).toEqual("Fun text");
    expect(actual[0].date).toEqual(expect.objectContaining({
        year: 1966,
        month: 4, // 0-index
        day: 23
    }));
    expect(actual[0].end).toEqual(expect.objectContaining(
        {
        year: 1966,
        month: 7,
        day: 1
    }));
    expect(actual[0].sort).toEqual({
        timestamp: 19660423,
        order: ''
    });
    expect(actual[0].note).toEqual(file.path);
    expect(actual[0].category).toEqual(category.id);
    expect(actual[0].img).toEqual("attachments/thing.png");
});

test("parseTimelineEvent", () => {
    let category = gregorian.calendar.categories[0];
    let actual: FcEvent[] = [];

    gregorian.parseTimelineEvents(
        "<span class='ob-timelines'   \n" +
        " data-category='natural-events' \n" +
        " data-fc-date='1966-05-23-00'\n" +
        " data-fc-end='1966-08-1-00'  \n" +
        " data-img='attachments/thing.png'  \n" +
        " data-title='Pretty name'>\n" +
        "Fun text" +
        "</span>",
        file,
        (event) => { actual.push(event)},
        category
    );

    expect(actual.length).toEqual(1);
    expect(actual[0].id).toBeDefined();
    expect(actual[0].name).toEqual("Pretty name");
    expect(actual[0].description.trim()).toEqual("Fun text");
    expect(actual[0].date).toEqual(expect.objectContaining({
        year: 1966,
        month: 4, // 0-index
        day: 23
    }));
    expect(actual[0].end).toEqual(expect.objectContaining(
        {
        year: 1966,
        month: 7,
        day: 1
    }));
    expect(actual[0].sort).toEqual({
        timestamp: 19660423,
        order: '00'
    });
    expect(actual[0].note).toEqual(file.path);
    expect(actual[0].category).toEqual(category.id);
    expect(actual[0].img).toEqual("attachments/thing.png");
});

test("Repeating events", () => {
    const expected: ParseDate = {
        year: null,
        month: null,
        day: null,
        order: ''
    };
    expect(gregorian.parseFcDateString("*-*-*", file)).toEqual(expected);

    expect(gregorian.parseFrontmatterDate({}, file)).toEqual(expected);

    expect(gregorian.parsedToTimestamp(expected)).toEqual({
        timestamp: Number.MIN_VALUE,
        order: "*-*-*"
    })
});

test("Repeating events with extra", () => {
    const expected: ParseDate = {
        year: null,
        month: null,
        day: null,
        order: '01 some extra flavor'
    };
    expect(gregorian.parseFcDateString("*-*-*-01 some extra flavor", file)).toEqual(expected);

    expect(gregorian.parseFrontmatterDate({
            order: '01 some extra flavor'
        }, file)).toEqual(expected);

    expect(gregorian.parsedToTimestamp(expected)).toEqual({
        timestamp: Number.MIN_VALUE,
        order: '01 some extra flavor'
    })
});

test("Repeating events with extra", () => {
    const expected: ParseDate = {
        year: null,
        month: null,
        day: null,
        order: '01 some extra flavor'
    };
    expect(gregorian.parseFcDateString("*-*-*-01 some extra flavor", file)).toEqual(expected);

    expect(gregorian.parseFrontmatterDate({
            order: '01 some extra flavor'
        }, file)).toEqual(expected);

    expect(gregorian.parsedToTimestamp(expected)).toEqual({
        timestamp: Number.MIN_VALUE,
        order: '01 some extra flavor'
    })
});