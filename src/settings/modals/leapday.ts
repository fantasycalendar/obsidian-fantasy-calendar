import {
    Modal,
    App,
    Setting,
    Notice,
    ButtonComponent,
    ExtraButtonComponent
} from "obsidian";
import type { Calendar, LeapDay, LeapDayCondition } from "../../@types";

import { getIntervalDescription, nanoid } from "../../utils/functions";

export class CreateLeapDayModal extends Modal {
    saved = false;
    leapday: LeapDay = {
        id: nanoid(6),
        name: "Leap Day",
        interval: [],
        intercalary: false,
        timespan: null,
        offset: 0,
        type: "leapday"
    };
    editing: boolean;
    infoEl: HTMLDivElement;
    conditionsEl: HTMLDivElement;
    constructor(app: App, public calendar: Calendar, leapday?: LeapDay) {
        super(app);
        if (leapday) {
            this.leapday = { ...leapday };
            this.editing = true;
        }
        this.containerEl.addClass("fantasy-calendar-create-leapday");
    }

    async display() {
        this.contentEl.empty();
        this.contentEl.createEl("h3", {
            text: this.editing ? "Edit Leap Day" : "New Leap Day"
        });

        this.infoEl = this.contentEl.createDiv("leapday-info");
        this.buildInfo();

        new Setting(this.contentEl)
            .addButton((b) => {
                b.setButtonText("Save")
                    .setCta()
                    .onClick(() => {
                        if (!this.leapday.interval.length) {
                            new Notice("The leap day must have an interval.");
                            return;
                        }
                        if (this.leapday.timespan == undefined) {
                            new Notice(
                                "The leap day must be attached to a Month."
                            );
                            return;
                        }
                        this.saved = true;
                        this.close();
                    });
            })
            .addExtraButton((b) => {
                b.setIcon("cross")
                    .setTooltip("Cancel")
                    .onClick(() => this.close());
            });
    }
    buildInfo() {
        this.infoEl.empty();

        new Setting(this.infoEl).setName("Name").addText((t) => {
            t.setValue(this.leapday.name).onChange((v) => {
                this.leapday.name = v;
            });
        });
        new Setting(this.infoEl)
            .setName("Month")
            .setDesc("The leap day will be added to this month.")
            .addDropdown((d) => {
                for (let month of this.calendar.static.months) {
                    const index = this.calendar.static.months.indexOf(month);
                    d.addOption(`${index}`, month.name);
                }
                d.setValue(`${this.leapday.timespan}`).onChange(
                    (v) => (this.leapday.timespan = Number(v))
                );
            });
        new Setting(this.infoEl)
            .setName("Offset")
            .setDesc("Shift the years the leap day is applied to.")
            .addText((t) => {
                t.inputEl.setAttr("type", "number");
                t.setValue(`${this.leapday.offset}`).onChange((v) => {
                    if (isNaN(Number(v))) return;
                    this.leapday.offset = Number(v);
                });
            });

        this.conditionsEl = this.infoEl.createDiv();
        this.buildConditions();
    }
    buildConditions() {
        this.conditionsEl.empty();

        const b = new ButtonComponent(this.conditionsEl)
            .setTooltip("Add New")
            .setButtonText("+")
            .onClick(async () => {
                const modal = new IntervalModal(
                    this.app,
                    this.intervals.length > 0
                );
                modal.onClose = () => {
                    if (!modal.saved) return;
                    this.leapday.interval.push(modal.condition);
                    this.buildConditions();
                };
                modal.open();
            });
        b.buttonEl.style.width = "100%";

        this.conditionsEl.createSpan({
            text: getIntervalDescription(this.leapday),
            cls: "fantasy-leap-day-interval-description setting-item"
        });

        for (let interval of this.intervals) {
            new Setting(this.conditionsEl)
                .setName(this.getIntervalName(interval))
                .addExtraButton((b) => {
                    b.setIcon("pencil")
                        .setTooltip("Edit")
                        .onClick(() => {
                            const modal = new IntervalModal(
                                this.app,
                                this.intervals.indexOf(interval) != 0,
                                interval
                            );
                            modal.onClose = () => {
                                if (!modal.saved) return;
                                this.leapday.interval.splice(
                                    this.leapday.interval.indexOf(interval),
                                    1,
                                    modal.condition
                                );
                                this.buildConditions();
                            };
                            modal.open();
                        });
                })
                .addExtraButton((b) => {
                    b.setIcon("trash")
                        .setTooltip("Delete")
                        .onClick(() => {
                            this.leapday.interval.splice(
                                this.leapday.interval.indexOf(interval),
                                1
                            );
                            if (
                                this.intervals.length &&
                                this.intervals[0].exclusive
                            ) {
                                this.intervals[0].exclusive = false;
                            }
                            this.buildConditions();
                        });
                });
        }
    }
    get intervals() {
        return this.leapday.interval.sort((a, b) => a.interval - b.interval);
    }
    getIntervalName(interval: LeapDayCondition) {
        const name = [`${interval.interval}`];
        if (interval.exclusive) {
            name.push("(Exclusive)");
        }
        if (interval.ignore) {
            name.push(" - Ignoring Offset");
        }
        return name.join(" ");
    }
    async onOpen() {
        await this.display();
    }
}

class IntervalModal extends Modal {
    saved: boolean = false;
    editing: boolean = false;
    condition: LeapDayCondition = {
        interval: null,
        exclusive: false,
        ignore: false
    };
    buttonsEl: HTMLDivElement;
    constructor(
        public app: App,
        public canBeExclusive?: boolean,
        condition?: LeapDayCondition
    ) {
        super(app);

        if (condition) {
            this.condition = { ...condition };
            this.editing = true;
        }
    }
    onOpen() {
        this.contentEl.empty();
        this.contentEl.createEl("h3", { text: "Leap Day Condition" });

        new Setting(this.contentEl)
            .setName("Interval")
            .setDesc("How often the condition applies.")
            .addText((t) => {
                t.inputEl.setAttr("type", "number");
                t.setValue(`${this.condition.interval}`).onChange((v) => {
                    if (isNaN(Number(v))) return;
                    this.condition.interval = Number(v);
                });
            });

        new Setting(this.contentEl)
            .setName("Exclusive")
            .setDesc(
                "If true, the leap day will not apply when the year meets the condition.\n\nRequires the leap day to have at least one non-exclusive condition."
            )

            .addToggle((t) =>
                t
                    .setDisabled(!this.canBeExclusive)
                    .setValue(this.condition.exclusive)
                    .onChange((v) => (this.condition.exclusive = v))
            );
        new Setting(this.contentEl)
            .setName("Ignore Offset")
            .setDesc(
                "The condition will ignore the leap day's offset when checking to apply."
            )
            .addToggle((t) =>
                t
                    .setValue(this.condition.ignore)
                    .onChange((v) => (this.condition.ignore = v))
            );

        this.buttonsEl = this.contentEl.createDiv("fantasy-context-buttons");
        new ButtonComponent(this.buttonsEl)
            .setCta()
            .setButtonText(this.editing ? "Save" : "Create")
            .onClick(() => {
                if (!this.condition.interval) {
                    new Notice("The condition requires an interval.");
                    return;
                }
                this.saved = true;
                this.close();
            });
        new ExtraButtonComponent(this.buttonsEl)
            .setTooltip("Cancel")
            .setIcon("cross")
            .onClick(() => this.close());
    }
}
