import { Moon, Phase } from ".";

class API {
    getMoons(
        date?: CurrentCalendarData,
        name?: string
    ): Array<{ moon: Moon; phase: Phase; icon: HTMLSpanElement }>;
}

export = API;
