import { FcEventDate } from "../src/@types";
import { FcEventHelper, ParseDate } from "../src/helper/event.helper";
import { PRESET_CALENDARS } from "../src/utils/presets";

const GREGORIAN = PRESET_CALENDARS.find((p) => p.name == "Gregorian Calendar");
const file = {
    path: "path",
    basename: "basename"
}

const input: FcEventDate = {
    year: 1400,
    month: 1,
    day: 28
};

test("YYYY-MM-DD", () => {
    const YMD = new FcEventHelper(GREGORIAN, true, 'YYYY-MM-DD');
    const datestring = '1400-02-28';
    expect(YMD.formatDigest).toEqual('YMD');
    expect(YMD.toFcDateString(input)).toEqual(datestring);
    expect(YMD.parseFcDateString(datestring, file)).toEqual(expect.objectContaining(input));
});
test("YYYY-MMM-DD", () => {
    const YMD = new FcEventHelper(GREGORIAN, true, 'YYYY-MMM-DD');
    const datestring = '1400-February-28';
    expect(YMD.formatDigest).toEqual('YMD');
    expect(YMD.toFcDateString(input)).toEqual(datestring);
    expect(YMD.parseFcDateString(datestring, file)).toEqual(expect.objectContaining(input));
});

test("M-D-Y", () => {
    const MDY = new FcEventHelper(GREGORIAN, true, 'M-D-Y');
    const datestring = "2-28-1400";
    expect(MDY.formatDigest).toEqual('MDY');
    expect(MDY.toFcDateString(input)).toEqual(datestring);
    expect(MDY.parseFcDateString(datestring, file)).toEqual(expect.objectContaining(input));
});

test("MM-D-Y", () => {
    const MDY = new FcEventHelper(GREGORIAN, true, 'MM-D-Y');
    const datestring = "02-28-1400";
    expect(MDY.formatDigest).toEqual('MDY');
    expect(MDY.toFcDateString(input)).toEqual(datestring);
    expect(MDY.parseFcDateString(datestring, file)).toEqual(expect.objectContaining(input));
});

test("DD-M-Y", () => {
    const DMY = new FcEventHelper(GREGORIAN, true, 'DD-M-Y');
    const datestring = "28-2-1400";
    expect(DMY.formatDigest).toEqual('DMY');
    expect(DMY.toFcDateString(input)).toEqual(datestring);
    expect(DMY.parseFcDateString(datestring, file)).toEqual(expect.objectContaining(input));
});

test("DD-MMM-Y", () => {
    const DMY = new FcEventHelper(GREGORIAN, true, 'DD-MMM-Y');
    const datestring = "28-February-1400";
    expect(DMY.formatDigest).toEqual('DMY');
    expect(DMY.toFcDateString(input)).toEqual(datestring);
    expect(DMY.parseFcDateString(datestring, file)).toEqual(expect.objectContaining(input));
});