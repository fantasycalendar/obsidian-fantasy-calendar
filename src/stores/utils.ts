import { FcDate } from "src/@types";

export function hash(date: Partial<FcDate>, max: number) {
    if (date.year == null || date.month == null || date.day == null)
        return null;
    const months = `${this.data.months.length}`.length;
    const month = `${date.month}`.padStart(months, "0");
    const days = `${max}`.length;
    const day = `${date.day}`.padStart(days, "0");
    return `${date.year}${month}${day}`;
}
