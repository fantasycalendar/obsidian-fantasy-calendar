import type { CurrentCalendarData, Moon, Phase } from "src/@types";
import type APIDefinition from "src/@types/api";
import CalendarHelper from "src/helper";
import FantasyCalendar from "src/main";

import MoonUI from "../view/ui/Moon.svelte";

export class API implements APIDefinition {
    constructor(private plugin: FantasyCalendar) {}
    getMoons(date?: CurrentCalendarData, name?: string) {
        const calendar = name
            ? this.plugin.data.calendars.find(
                  ({ name: c_name }) => c_name == name
              )
            : this.plugin.defaultCalendar ?? this.plugin.defaultCalendar;
        const helper = this._getHelper(calendar);

        const dateToGet = date ? date : helper.current;

        const day = helper.getDayForDate(dateToGet);

        let moons: Array<{ icon: HTMLSpanElement; moon: Moon; phase: Phase }> =
            [];
        for (const [moon, phase] of day.moons) {
            const target = createSpan();
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
