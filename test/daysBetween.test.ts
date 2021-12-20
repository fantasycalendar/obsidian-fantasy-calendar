import { daysBetween } from "../src/utils/functions";

test("Days between - 1", () => {
    expect(daysBetween(new Date("12-20-2021"), new Date("12-21-2021"))).toBe(1);
});
test("Days between - 0", () => {
    expect(daysBetween(new Date("12-20-2021"), new Date("12-20-2021"))).toBe(0);
});
test("Days between - new year", () => {
    expect(daysBetween(new Date("12-31-2021"), new Date("01-01-2022"))).toBe(1);
});
test("Days between - between hours", () => {
    expect(daysBetween(new Date("12-30-2021 12:30:00"), new Date("12-31-2021 12:00:00"))).toBe(1);
});
test("Days between - between hours short", () => {
    expect(daysBetween(new Date("12-30-2021 23:59:00"), new Date("12-31-2021 00:00:00"))).toBe(1);
});
test("Days between - between hours 0", () => {
    expect(daysBetween(new Date("12-30-2021 00:00:00"), new Date("12-30-2021 11:59:59"))).toBe(0);
});
test("Days between - big jump", () => {
    expect(daysBetween(new Date("01-01-2021"), new Date("12-31-2021"))).toBe(364);
});
