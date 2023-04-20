import {
    addIcon,
    ButtonComponent,
    DropdownComponent,
    FileView,
    ItemView,
    MarkdownRenderer,
    MarkdownView,
    Menu,
    Modal,
    normalizePath,
    Notice,
    Setting,
    stringifyYaml,
    TextComponent,
    TFile,
    WorkspaceLeaf
} from "obsidian";
import type { Calendar, CurrentCalendarData, Event } from "src/@types";
import type { DayHelper } from "src/helper";
import CalendarHelper from "src/helper";
import { CreateEventModal } from "src/settings/modals/event/event";
import type FantasyCalendar from "../main";

export const VIEW_TYPE = "FANTASY_CALENDAR";
export const FULL_VIEW = "FANTASY_CALENDAR_FULL_VIEW";

import CalendarUI from "./ui/Calendar.svelte";
import { confirmEventDeletion } from "src/settings/modals/confirm";
import { areDatesEqual, daysBetween } from "src/utils/functions";
import { MODIFIER_KEY } from "../main";
import { FantasyCalendarModal } from "src/settings/modals/modal";

addIcon(
    VIEW_TYPE,
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14" role="img" viewBox="0 0 448 512"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"/><path fill="currentColor" d="M18.32 255.78L192 223.96l-91.28 68.69c-10.08 10.08-2.94 27.31 11.31 27.31h222.7c-9.44-26.4-14.73-54.47-14.73-83.38v-42.27l-119.73-87.6c-23.82-15.88-55.29-14.01-77.06 4.59L5.81 227.64c-12.38 10.33-3.45 30.42 12.51 28.14zm556.87 34.1l-100.66-50.31A47.992 47.992 0 0 1 448 196.65v-36.69h64l28.09 22.63c6 6 14.14 9.37 22.63 9.37h30.97a32 32 0 0 0 28.62-17.69l14.31-28.62a32.005 32.005 0 0 0-3.02-33.51l-74.53-99.38C553.02 4.7 543.54 0 533.47 0H296.02c-7.13 0-10.7 8.57-5.66 13.61L352 63.96 292.42 88.8c-5.9 2.95-5.9 11.36 0 14.31L352 127.96v108.62c0 72.08 36.03 139.39 96 179.38-195.59 6.81-344.56 41.01-434.1 60.91C5.78 478.67 0 485.88 0 494.2 0 504 7.95 512 17.76 512h499.08c63.29.01 119.61-47.56 122.99-110.76 2.52-47.28-22.73-90.4-64.64-111.36zM489.18 66.25l45.65 11.41c-2.75 10.91-12.47 18.89-24.13 18.26-12.96-.71-25.85-12.53-21.52-29.67z" style="&#10;    transform: scale(0.4125) translate(50%, 95%);&#10;"/></svg>`
);

addIcon(
    "fantasy-calendar-reveal",
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-day" class="svg-inline--fa fa-calendar-day fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-96zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"/></svg>`
);

declare module "obsidian" {
    interface WorkspaceItem {
        id: string;
    }
}

export default class FantasyCalendarView extends ItemView {
    dropdownEl: HTMLDivElement;
    helper: CalendarHelper;
    noCalendarEl: HTMLDivElement;
    updateMe: boolean = true;
    dayNumber: boolean;
    /* full =  false; */
    get root() {
        return this.leaf.getRoot();
    }
    get full() {
        return !("collapse" in this.root);
    }
    yearView: boolean = false;
    moons: boolean = true;
    calendar: Calendar;
    /* calendarDropdownEl: HTMLDivElement; */
    protected _app: CalendarUI;
    constructor(
        public plugin: FantasyCalendar,
        public leaf: WorkspaceLeaf,
        public options: { calendar?: Calendar; full?: boolean } = {}
    ) {
        super(leaf);
        this.containerEl.addClass("fantasy-calendar-view");
        this.contentEl.addClass("fantasy-calendar-view-content");
        this.registerEvent(
            this.plugin.app.workspace.on("fantasy-calendars-updated", () => {
                this.plugin.onSettingsLoad(() => this.updateCalendars());
            })
        );
        this.registerEvent(
            this.plugin.app.workspace.on("layout-change", () => {
                if (!this._app) return;
                this._app.$set({
                    fullView: this.full,
                    ...(this.full ? { dayView: false } : {})
                });
            })
        );
        /* window.view = this; */
    }
    updateCalendars() {
        if (!this.updateMe) {
            this.updateMe = true;
            return;
        }
        if (!this.plugin.data.calendars.length) {
            this._app?.$destroy();
            this.contentEl.empty();
            this.noCalendarEl = this.contentEl.createDiv("fantasy-no-calendar");
            this.noCalendarEl.createSpan({
                text: "No calendars created! Create a calendar to see it here."
            });
            return;
        }

        const calendar =
            this.plugin.data.calendars.find((c) => c.id == this.calendar?.id) ??
            this.plugin.defaultCalendar ??
            this.plugin.data.calendars[0];

        if (this.helper && this.helper.calendar.id == calendar.id) {
            this.update(calendar);
        } else {
            this.setCurrentCalendar(calendar);
        }
    }
    update(calendar: Calendar) {
        this.calendar = calendar;
        this.helper.update(this.calendar);

        this.registerCalendarInterval();

        if (!this._app) {
            this.build();
        } else {
            this._app.$set({ calendar: this.helper });
        }
    }

    async registerCalendarInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (this.calendar.static.incrementDay) {
            let current = new Date();

            if (!this.calendar.date) {
                this.calendar.date = current.valueOf();
            }

            const dif = daysBetween(new Date(this.calendar.date), current);

            if (dif >= 1) {
                for (let i = 0; i < dif; i++) {
                    this.helper.goToNextCurrentDay();
                }
                this.calendar.date = current.valueOf();
                await this.saveCalendarss();
            }
            this.interval = window.setInterval(async () => {
                if (daysBetween(new Date(), current) >= 1) {
                    this.helper.goToNextCurrentDay();
                    this.helper.current;
                    current = new Date();
                    this.calendar.date = current.valueOf();
                    await this.saveCalendarss();
                }
            }, 60 * 1000);

            this.registerInterval(this.interval);
        }
    }

    async saveCalendarss() {
        this.updateMe = false;
        await this.plugin.saveCalendars();
    }

    interval: number;

    setCurrentCalendar(calendar: Calendar) {
        this.noCalendarEl?.detach();

        this.calendar = calendar;

        this.moons = this.calendar.static.displayMoons;
        this.dayNumber = this.calendar.static.displayDayNumber;
        this.helper = new CalendarHelper(this.calendar, this.plugin);

        this.registerCalendarInterval();

        this.build();
    }
    createEventForDay(date: CurrentCalendarData) {
        const modal = new CreateEventModal(
            this.plugin,
            this.calendar,
            null,
            date
        );

        modal.onClose = async () => {
            if (!modal.saved) return;
            this.calendar.events.push(modal.event);

            this.helper.addEvent(modal.event);

            await this.saveCalendarss();

            this._app.$set({
                calendar: this.helper
            });

            this.triggerHelperEvent("day-update");
        };

        modal.open();
    }

    async onOpen() {
        this.plugin.onSettingsLoad(() => this.updateCalendars());
    }
    build() {
        this.contentEl.empty();
        this._app = new CalendarUI({
            target: this.contentEl,
            props: {
                calendar: this.helper,
                fullView: this.full,
                yearView: this.yearView,
                moons: this.moons,
                displayWeeks: this.helper.displayWeeks,
                displayDayNumber: this.dayNumber
            }
        });
        this._app.$on("day-click", (event: CustomEvent<DayHelper>) => {
            const day = event.detail;

            if (day.events.length) return;
            this.createEventForDay(day.date);
        });

        this._app.$on("day-doubleclick", (event: CustomEvent<DayHelper>) => {
            const day = event.detail;
            if (!day.events.length) return;

            this.helper.viewing.day = day.number;
            this.helper.viewing.month = day.month.number;
            this.helper.viewing.year = day.month.year;

            this.yearView = false;

            this._app.$set({ yearView: false });
            this._app.$set({ dayView: true });
            this.triggerHelperEvent("day-update", false);
        });

        this._app.$on(
            "day-context-menu",
            (event: CustomEvent<{ day: DayHelper; evt: MouseEvent }>) => {
                const { day, evt } = event.detail;

                const menu = new Menu(this.app);

                menu.setNoIcon();

                if (!this.full) {
                    menu.addItem((item) => {
                        item.setTitle("Open Day").onClick(() => {
                            this.openDay({
                                day: day.number,
                                month: this.helper.displayed.month,
                                year: this.helper.displayed.year
                            });
                        });
                    });
                }
                menu.addItem((item) => {
                    item.setTitle("Set as Today").onClick(async () => {
                        this.calendar.current = day.date;

                        this.helper.current.day = day.number;

                        this.triggerHelperEvent("day-update");

                        await this.saveCalendarss();
                    });
                });
                menu.addItem((item) =>
                    item.setTitle("New Event").onClick(() => {
                        this.createEventForDay(day.date);
                    })
                );
                menu.showAtMouseEvent(evt);
            }
        );

        this._app.$on("settings", (event: CustomEvent<MouseEvent>) => {
            const evt = event.detail;
            const menu = new Menu(this.app);

            menu.setNoIcon();
            menu.addItem((item) => {
                item.setTitle(
                    `${this.calendar.displayWeeks ? "Hide" : "Show"} Weeks`
                ).onClick(async () => {
                    this.calendar.displayWeeks = !this.calendar.displayWeeks;
                    this.helper.update(this.calendar);
                    this._app.$set({
                        displayWeeks: this.calendar.displayWeeks
                    });
                    await this.saveCalendarss();
                });
            });
            menu.addItem((item) => {
                item.setTitle(
                    `Open ${this.yearView ? "Month" : "Year"}`
                ).onClick(() => {
                    this.yearView = !this.yearView;
                    this._app.$set({ yearView: this.yearView });
                });
            });
            menu.addItem((item) => {
                item.setTitle(
                    this.moons ? "Hide Moons" : "Display Moons"
                ).onClick(() => {
                    this.toggleMoons();
                });
            });
            menu.addItem((item) => {
                item.setTitle(
                    this.dayNumber ? "Hide Day Number" : "Display Day Number"
                ).onClick(async () => {
                    this.dayNumber = !this.dayNumber;
                    this.calendar.static.displayDayNumber = this.dayNumber;
                    this._app.$set({ displayDayNumber: this.dayNumber });
                    await this.saveCalendarss();
                });
            });
            menu.addItem((item) => {
                item.setTitle("View Day");

                item.onClick(() => {
                    this.openDate();
                });
            });
            menu.addItem((item) => {
                item.setTitle("Switch Calendars");
                item.setDisabled(this.plugin.data.calendars.length <= 1);
                item.onClick(() => {
                    const modal = new SwitchModal(this.plugin, this.calendar);

                    modal.onClose = () => {
                        if (!modal.confirmed) return;

                        this.setCurrentCalendar(modal.calendar);
                    };
                    modal.open();
                });
            });

            menu.showAtMouseEvent(evt);
        });

        this._app.$on(
            "event-click",
            (evt: CustomEvent<{ event: Event; modifier: boolean }>) => {
                const { event, modifier } = evt.detail;
                if (event.note) {
                    let leaves: WorkspaceLeaf[] = [];
                    this.app.workspace.iterateAllLeaves((leaf) => {
                        if (!(leaf.view instanceof MarkdownView)) return;
                        if (leaf.view.file.basename === event.note) {
                            leaves.push(leaf);
                        }
                    });
                    if (leaves.length) {
                        this.app.workspace.setActiveLeaf(leaves[0]);
                    } else {
                        this.app.workspace.openLinkText(
                            event.note,
                            "",
                            this.full || modifier
                        );
                    }
                } else {
                    const modal = new ViewEventModal(event, this.plugin);
                    modal.open();
                }
            }
        );

        this._app.$on(
            "event-mouseover",
            (evt: CustomEvent<{ target: HTMLElement; event: Event }>) => {
                if (!this.plugin.data.eventPreview) return;
                const { target, event } = evt.detail;
                if (event.note) {
                    this.app.workspace.trigger(
                        "link-hover",
                        this, //hover popover, but don't need
                        target, //targetEl
                        event.note, //linkText
                        "" //source
                    );
                }
            }
        );

        this._app.$on(
            "event-context",
            (custom: CustomEvent<{ evt: MouseEvent; event: Event }>) => {
                const { evt, event } = custom.detail;

                const menu = new Menu(this.app);

                menu.setNoIcon();

                if (!event.note) {
                    menu.addItem((item) => {
                        item.setTitle("Create Note").onClick(async () => {
                            const path =
                                this.app.workspace.getActiveFile()?.path;
                            const newFilePath = path
                                ? this.app.fileManager.getNewFileParent(path)
                                      ?.parent ?? "/"
                                : "/";

                            const date = `${event.date.year}-${
                                event.date.month + 1
                            }-${event.date.day}`;

                            let end: string;
                            if (event.end) {
                                end = `${event.end.year}-${
                                    event.end.month + 1
                                }-${event.end.day}`;
                            }

                            const content = {
                                "fc-calendar": this.calendar.name,
                                "fc-date": date,
                                ...(event.end ? { "fc-end": end } : {}),
                                ...(event.category
                                    ? {
                                          "fc-category":
                                              this.calendar.categories.find(
                                                  (cat) =>
                                                      cat.id == event.category
                                              )?.name
                                      }
                                    : {}),
                                "fc-display-name": event.name
                            };
                            event.note = normalizePath(
                                `${newFilePath}/${event.name}.md`
                            );

                            let file = this.app.vault.getAbstractFileByPath(
                                event.note
                            );
                            if (!file) {
                                file = await this.app.vault.create(
                                    event.note,
                                    `---\n${stringifyYaml(content)}\n---`
                                );
                            }
                            await this.saveCalendarss();

                            if (file instanceof TFile) {
                                const fileViews =
                                    this.app.workspace.getLeavesOfType(
                                        "markdown"
                                    );
                                const existing = fileViews.find((l) => {
                                    l.view instanceof FileView &&
                                        l.view.file.path == event.note;
                                });
                                if (existing) {
                                    this.app.workspace.setActiveLeaf(existing);
                                } else {
                                    await this.app.workspace
                                        .getUnpinnedLeaf()
                                        .openFile(file, {
                                            active: true
                                        });
                                }
                            }
                        });
                    });
                }

                menu.addItem((item) => {
                    item.setTitle("Edit Event").onClick(() => {
                        const modal = new CreateEventModal(
                            this.plugin,
                            this.calendar,
                            event
                        );

                        modal.onClose = async () => {
                            if (!modal.saved) return;

                            const existing = this.calendar.events.find(
                                (e) => e.id == event.id
                            );

                            this.calendar.events.splice(
                                this.calendar.events.indexOf(existing),
                                1,
                                modal.event
                            );

                            this.helper.refreshMonth(
                                modal.event.date.month,
                                modal.event.date.year
                            );
                            if (
                                modal.event.date.month != existing.date.month ||
                                modal.event.date.year != existing.date.year
                            ) {
                                this.helper.refreshMonth(
                                    existing.date.month,
                                    existing.date.year
                                );
                            }

                            await this.saveCalendarss();

                            this._app.$set({
                                calendar: this.helper
                            });

                            this.triggerHelperEvent("day-update");
                        };

                        modal.open();
                    });
                });

                menu.addItem((item) => {
                    item.setTitle("Delete Event").onClick(async () => {
                        if (
                            !this.plugin.data.exit.event &&
                            !(await confirmEventDeletion(this.plugin))
                        )
                            return;
                        const existing = this.calendar.events.find(
                            (e) => e.id == event.id
                        );

                        this.calendar.events.splice(
                            this.calendar.events.indexOf(existing),
                            1
                        );

                        this.helper.refreshMonth(
                            existing.date.month,
                            existing.date.year
                        );

                        await this.saveCalendarss();

                        this._app.$set({
                            calendar: this.helper
                        });

                        this.triggerHelperEvent("day-update");
                    });
                });

                menu.showAtMouseEvent(evt);
            }
        );

        this._app.$on("event", (e: CustomEvent<CurrentCalendarData>) => {
            const date = e.detail;
            this.createEventForDay(date);
        });

        this._app.$on("reset", () => {
            this.helper.reset();

            this.yearView = false;

            this._app.$set({ yearView: false });
            this._app.$set({ dayView: true });
            this.triggerHelperEvent("day-update", false);
        });
    }
    openDay(date: CurrentCalendarData) {
        this.helper.viewing.day = date.day;
        this.helper.viewing.month = date.month;
        this.helper.viewing.year = date.year;

        this.yearView = false;

        this._app.$set({ yearView: false });
        this._app.$set({ dayView: true });
        this.triggerHelperEvent("day-update", false);
    }
    openDate() {
        if (!this.helper) return;
        if (!this.calendar) return;
        const modal = new ChangeDateModal(this.plugin, this.calendar);
        modal.onClose = async () => {
            if (!modal.confirmed) return;
            if (modal.setCurrent) {
                this.calendar.current = { ...modal.date };
                this.setCurrentCalendar(this.calendar);
            } else {
                this.helper.displayed = { ...modal.date };
                this.helper.update();
                this._app.$set({ calendar: this.helper });
            }

            await this.saveCalendarss();
        };

        modal.open();
    }
    toggleMoons() {
        this.moons = !this.moons;
        this._app.$set({ moons: this.moons });
    }

    async onClose() {}
    onResize() {
        this.triggerHelperEvent("view-resized", false);
    }
    getViewType() {
        return VIEW_TYPE;
    }
    getDisplayText() {
        return "Fantasy Calendar";
    }
    getIcon() {
        return VIEW_TYPE;
    }
    triggerHelperEvent(event: string, full: boolean = true) {
        if (!this.helper) return;
        this.helper.trigger(event);

        if (full) {
            this.updateMe = false;
            this.plugin.app.workspace.trigger("fantasy-calendars-updated");
        }
    }

    async onunload() {}
}

/* export class FullCalendarView extends FantasyCalendarView {
    full = true;
}
 */
class SwitchModal extends FantasyCalendarModal {
    confirmed: boolean = false;
    constructor(public plugin: FantasyCalendar, public calendar: Calendar) {
        super(plugin.app);
    }
    async display() {
        this.contentEl.empty();
        this.contentEl.createEl("h4", { text: "Switch Calendars" });
        const dropdownEl = this.contentEl.createDiv(
            "fantasy-calendar-dropdown"
        );
        dropdownEl.createEl("label", {
            text: "Choose a Calendar"
        });
        const dropdown = new DropdownComponent(dropdownEl).onChange((v) => {
            this.calendar = this.plugin.data.calendars.find((c) => c.id == v);
        });
        dropdown
            .addOptions(
                Object.fromEntries(
                    this.plugin.data.calendars.map((c) => [c.id, c.name])
                )
            )
            .setValue(this.calendar ? this.calendar.id : null);
        const buttonEl = this.contentEl.createDiv(
            "fantasy-calendar-confirm-buttons"
        );
        new ButtonComponent(buttonEl)
            .setButtonText("Switch")
            .setCta()
            .onClick(() => {
                this.confirmed = true;
                this.close();
            });
        new ButtonComponent(buttonEl).setButtonText("Cancel").onClick(() => {
            this.close();
        });
    }
    onOpen() {
        this.display();
    }
}

class ChangeDateModal extends FantasyCalendarModal {
    confirmed: boolean = false;
    date: CurrentCalendarData;
    dateFieldEl: HTMLDivElement;
    tempCurrentDays: number;
    setCurrent: boolean = false;

    constructor(public plugin: FantasyCalendar, public calendar: Calendar) {
        super(plugin.app);
        this.date = { ...this.calendar.current };
        this.tempCurrentDays = this.date.day;
    }
    async display() {
        this.contentEl.empty();
        this.contentEl.createEl("h4", { text: "View Day" });
        this.dateFieldEl = this.contentEl.createDiv(
            "fantasy-calendar-date-fields"
        );
        this.buildDateFields();

        new Setting(this.contentEl)
            .setName("Set as Current Date")
            .setDesc("Also set this date to today's date.")
            .addToggle((t) =>
                t.setValue(this.setCurrent).onChange((v) => {
                    this.setCurrent = v;
                })
            );

        const buttonEl = this.contentEl.createDiv(
            "fantasy-calendar-confirm-buttons"
        );

        new ButtonComponent(buttonEl)
            .setButtonText("Switch")
            .setCta()
            .onClick(() => {
                this.confirmed = true;
                this.date.day = this.tempCurrentDays;
                this.close();
            });
        new ButtonComponent(buttonEl).setButtonText("Cancel").onClick(() => {
            this.close();
        });
    }
    buildDateFields() {
        this.dateFieldEl.empty();
        if (
            this.tempCurrentDays != undefined &&
            this.date.month != undefined &&
            this.tempCurrentDays >
                this.calendar.static.months[this.date.month]?.length
        ) {
            this.tempCurrentDays =
                this.calendar.static.months[this.date.month]?.length;
        }
        const dayEl = this.dateFieldEl.createDiv("fantasy-calendar-date-field");
        dayEl.createEl("label", { text: "Day" });
        const day = new TextComponent(dayEl)
            .setPlaceholder("Day")
            .setValue(`${this.tempCurrentDays}`)
            .setDisabled(this.date.month == undefined)
            .onChange((v) => {
                if (
                    Number(v) < 1 ||
                    (Number(v) >
                        this.calendar.static.months[this.date.month]?.length ??
                        Infinity)
                ) {
                    new Notice(
                        `The current day must be between 1 and ${
                            this.calendar.static.months[this.date.month].length
                        }`
                    );
                    this.tempCurrentDays = this.date.day;
                    this.buildDateFields();
                    return;
                }
                this.tempCurrentDays = Number(v);
            });
        day.inputEl.setAttr("type", "number");

        const monthEl = this.dateFieldEl.createDiv(
            "fantasy-calendar-date-field"
        );
        monthEl.createEl("label", { text: "Month" });
        new DropdownComponent(monthEl)
            .addOptions(
                Object.fromEntries([
                    ["select", "Select Month"],
                    ...this.calendar.static.months.map((month) => [
                        month.name,
                        month.name
                    ])
                ])
            )
            .setValue(
                this.date.month != undefined
                    ? this.calendar.static.months[this.date.month].name
                    : "select"
            )
            .onChange((v) => {
                if (v === "select") this.date.month = null;
                const index = this.calendar.static.months.find(
                    (m) => m.name == v
                );
                this.date.month = this.calendar.static.months.indexOf(index);
                this.buildDateFields();
            });

        const yearEl = this.dateFieldEl.createDiv(
            "fantasy-calendar-date-field"
        );
        yearEl.createEl("label", { text: "Year" });
        if (this.calendar.static.useCustomYears) {
            const yearDrop = new DropdownComponent(yearEl);
            (this.calendar.static.years ?? []).forEach((year) => {
                yearDrop.addOption(year.id, year.name);
            });
            if (this.date.year > this.calendar.static.years?.length) {
                this.date.year = this.calendar.static.years
                    ? this.calendar.static.years.length
                    : null;
            }
            yearDrop
                .setValue(this.calendar.static.years?.[this.date.year - 1]?.id)
                .onChange((v) => {
                    this.date.year =
                        this.calendar.static.years.findIndex((y) => y.id == v) +
                        1;
                });
        } else {
            const year = new TextComponent(yearEl)
                .setPlaceholder("Year")
                .setValue(`${this.date.year}`)
                .onChange((v) => {
                    this.date.year = Number(v);
                });
            year.inputEl.setAttr("type", "number");
        }
    }
    onOpen() {
        this.display();
    }
}

class ViewEventModal extends FantasyCalendarModal {
    constructor(public event: Event, public plugin: FantasyCalendar) {
        super(plugin.app);
        this.containerEl.addClass("fantasy-calendar-view-event");
    }
    async display() {
        this.contentEl.empty();
        this.contentEl.createEl("h4", { text: this.event.name });

        await MarkdownRenderer.renderMarkdown(
            this.event.description,
            this.contentEl,
            this.event.note,
            null
        );
    }
    async onOpen() {
        await this.display();
    }
}
