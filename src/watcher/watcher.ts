import { wrap } from "src/utils/functions";
import { Component, TFile, TFolder, Vault } from "obsidian";
import type { Calendar, CurrentCalendarData } from "src/@types";
import type FantasyCalendar from "src/main";

export class Watcher extends Component {
    get calendars() {
        return this.plugin.data.calendars;
    }
    get vault() {
        return this.plugin.app.vault;
    }
    get metadataCache() {
        return this.plugin.app.metadataCache;
    }

    constructor(public plugin: FantasyCalendar) {
        super();
    }

    files: Map<string, Set<Calendar>> = new Map();

    onload() {
        this.recurseFiles();

        this.registerEvent(
            this.metadataCache.on("changed", (file) => {
                this.parseFileForEvents(file);
                this.plugin.saveCalendar();
            })
        );
        this.registerEvent(
            this.vault.on("rename", (abstractFile, oldPath) => {
                if (!(abstractFile instanceof TFile)) return;
                if (!this.files.has(oldPath)) {
                    this.parseFileForEvents(abstractFile);
                    this.plugin.saveCalendar();
                    return;
                }
                const calendars = this.files.get(oldPath);

                for (let calendar of calendars) {
                    const events = calendar.events.filter(
                        (e) => e.note == oldPath
                    );
                    for (let event of events) {
                        event.note = abstractFile.path;
                        event.name = event.id = abstractFile.basename;
                    }
                }
                this.files.set(abstractFile.path, new Set([...calendars]));
                this.files.delete(oldPath);
                this.plugin.saveCalendar();
            })
        );
    }
    recurseFiles() {
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;
        this.recurseFolder(folder);
        this.plugin.saveCalendar();
    }
    registerCalendar(calendar: Calendar) {
        console.log("[Fantasy Calendar] Parsing files for events.");
        const folder = this.vault.getAbstractFileByPath(this.plugin.data.path);
        if (!folder || !(folder instanceof TFolder)) return;
        this.recurseFolder(folder, calendar);
        console.log("[Fantasy Calendar] Parsing complete.");
    }
    recurseFolder(folder: TFolder, calendar?: Calendar) {
        Vault.recurseChildren(folder, (abstractFile) => {
            if (!abstractFile) return;

            if (abstractFile instanceof TFile) {
                this.parseFileForEvents(abstractFile, calendar);
            }
        });
    }
    testPath(filePath: string) {
        return (
            `/${filePath}`.match(new RegExp(`^${this.plugin.data.path}`)) !=
            null
        );
    }

    parseFileForEvents(file: TFile, calendar?: Calendar) {
        //if the file is not in a calendar watch path, return;
        if (!this.testPath(file.path)) return;

        const cache = this.metadataCache.getFileCache(file);
        if (!cache) return;

        const { frontmatter } = cache ?? {};
        if (!frontmatter) return;
        if (
            !("fc-calendar" in frontmatter) &&
            !("fc-date" in frontmatter || "fc-start" in frontmatter)
        )
            return;

        let dates =
            (frontmatter["fc-date"] as
                | string
                | string[]
                | CurrentCalendarData
                | CurrentCalendarData[]) ??
            (frontmatter["fc-start"] as
                | string
                | string[]
                | CurrentCalendarData
                | CurrentCalendarData[]);
        const dateArray: Array<CurrentCalendarData> = [dates]
            .flat(2)
            .map((date) => parseDate(date));

        let ends =
            "fc-end" in frontmatter
                ? (frontmatter["fc-end"] as
                      | string
                      | string[]
                      | CurrentCalendarData
                      | CurrentCalendarData[])
                : [];
        const endArray: Array<CurrentCalendarData> = [ends]
            .flat(2)
            .map((date) => parseDate(date));

        //check for fc-calendar
        let names = frontmatter["fc-calendar"] as string | string[];
        if (!Array.isArray(names)) names = [names];
        const calendars = calendar
            ? [calendar]
            : this.calendars.filter((calendar) =>
                  names.includes(calendar.name)
              );

        if (!calendars.length) return;

        const fcCategory = frontmatter["fc-category"];

        const set = this.files.get(file.path) ?? new Set<Calendar>();
        for (let name of names) {
            const calendar = calendars.find((c) => c.name == name);
            if (!calendar) continue;

            set.add(calendar);
            let index = names.indexOf(name);

            /** Clamp index to length of dates provided. */
            if (index >= dateArray.length) {
                index = dateArray.length - 1;
            }

            let date = (dateArray[index] as CurrentCalendarData) ?? {
                day: null,
                month: null,
                year: null
            };

            let end: CurrentCalendarData = endArray.length
                ? endArray[index] ?? endArray[endArray.length - 1]
                : null;

            if (date?.month && typeof date?.month == "string") {
                let month = calendar.static.months.find(
                    (m) => m.name == (date.month as unknown as string)
                );
                if (!month) {
                    date.month = null;
                } else {
                    date.month = calendar.static.months.indexOf(month);
                }
            } else if (date?.month && typeof date?.month == "number") {
                date.month = wrap(
                    date.month - 1,
                    calendar.static.months.length
                );
            }
            if (end?.month && typeof end?.month == "string") {
                let month = calendar.static.months.find(
                    (m) => m.name == (end.month as unknown as string)
                );
                if (!month) {
                    end.month = null;
                } else {
                    end.month = calendar.static.months.indexOf(month);
                }
            } else if (end?.month && typeof end?.month == "number") {
                end.month = wrap(end.month - 1, calendar.static.months.length);
            }

            const category = calendar.categories.find(
                (cat) => cat?.name == fcCategory
            );

            const existing = calendar.events.find(
                (event) => event.note == file.path
            );

            if (
                existing?.date.day == date.day &&
                existing?.date.month == date.month &&
                existing?.date.year == date.year &&
                existing?.end?.day == end?.day &&
                existing?.end?.month == end?.month &&
                existing?.end?.year == end?.year &&
                existing?.category == category?.id
            ) {
                continue;
            } else if (existing) {
                calendar.events.splice(calendar.events.indexOf(existing), 1, {
                    id: file.basename,
                    name: file.basename,
                    note: file.path,
                    date,
                    ...(end ? { end } : {}),
                    category: category?.id,
                    description: null
                });
            } else {
                calendar.events.push({
                    id: file.basename,
                    name: file.basename,
                    note: file.path,
                    date,
                    ...(end ? end : {}),
                    category: category?.id,
                    description: null
                });
            }
        }
        this.files.set(file.path, set);
    }
    onunload() {}
}

const parseDate = (date: string | CurrentCalendarData) => {
    if (typeof date === "string") {
        try {
            const split = date.split(/[\-\/]/).map((d) => Number(d));

            return {
                year: split[0],
                month: split[1],
                day: split[2]
            };
        } catch (e) {
            return;
        }
    } else {
        return date;
    }
};
