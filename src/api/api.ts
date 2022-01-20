import type { Moon, CurrentCalendarData } from "src/@types";
import CalendarHelper from "src/helper";
import FantasyCalendar from "src/main";
import type { Phase } from "src/utils/constants";

import MoonUI from "../view/ui/Moon.svelte";

export class API {
    constructor(private plugin: FantasyCalendar) {}
    getMoons({
        date,
        name,
        icon
    }: {
        date?: CurrentCalendarData;
        name?: string;
        icon?: boolean;
    } = {}) {
        const calendar = name
            ? this.plugin.data.calendars.find(
                  ({ name: c_name }) => c_name == name
              )
            : this.plugin.defaultCalendar ?? this.plugin.defaultCalendar;
        const helper = this._getHelper(calendar);

        const dateToGet = date ? date : helper.current;

        const day = helper.getDayForDate(dateToGet);

        let moons = [];
        for (const [moon, phase] of day.moons) {
            const target = createDiv();
            new MoonUI({
                target,
                props: {
                    moon,
                    phase
                }
            });
            moons.push({ icon: target, moon, phase });
        }
        return moons;
    }
    private _getHelper(calendar = this.plugin.defaultCalendar) {
        return new CalendarHelper(calendar, this.plugin);
    }
}
