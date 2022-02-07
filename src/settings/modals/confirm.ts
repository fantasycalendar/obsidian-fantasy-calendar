import { App, ButtonComponent, ExtraButtonComponent, Modal } from "obsidian";
import FantasyCalendar from "src/main";

export async function confirmWithModal(
    app: App,
    text: string,
    buttons: { cta: string; secondary: string } = {
        cta: "Yes",
        secondary: "No"
    }
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const modal = new ConfirmModal(app, text, buttons);
            modal.onClose = () => {
                resolve(modal.confirmed);
            };
            modal.open();
        } catch (e) {
            reject();
        }
    });
}

export class ConfirmModal extends Modal {
    constructor(
        app: App,
        public text: string,
        public buttons: { cta: string; secondary: string }
    ) {
        super(app);
    }
    confirmed: boolean = false;
    async display() {
        this.contentEl.empty();
        this.contentEl.addClass("confirm-modal");
        this.contentEl.createEl("p", {
            text: this.text
        });
        const buttonEl = this.contentEl.createDiv(
            "fantasy-calendar-confirm-buttons"
        );
        new ButtonComponent(buttonEl)
            .setButtonText(this.buttons.cta)
            .setCta()
            .onClick(() => {
                this.confirmed = true;
                this.close();
            });
        new ButtonComponent(buttonEl)
            .setButtonText(this.buttons.secondary)
            .onClick(() => {
                this.close();
            });
    }
    onOpen() {
        this.display();
    }
}
export async function confirmDeleteCalendar(
    plugin: FantasyCalendar
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const modal = new ConfirmDeleteCalendarModal(plugin);
            modal.onClose = () => {
                resolve(modal.confirmed);
            };
            modal.open();
        } catch (e) {
            reject();
        }
    });
}
class ConfirmDeleteCalendarModal extends Modal {
    confirmed: boolean = false;
    constructor(public plugin: FantasyCalendar) {
        super(plugin.app);
    }
    async display() {
        this.contentEl.empty();
        this.contentEl.addClass("confirm-modal");
        this.contentEl.createEl("p", {
            text: "Are you sure you want to delete this calendar?"
        });

        const buttonContainerEl = this.contentEl.createDiv(
            "fantasy-calendar-confirm-buttons-container"
        );
        buttonContainerEl.createEl("a").createEl("small", {
            cls: "dont-ask",
            text: "Delete and don't ask again"
        }).onclick = () => {
            this.confirmed = true;
            this.plugin.data.exit.calendar = true;
            this.plugin.saveSettings();
            this.close();
        };

        const buttonEl = buttonContainerEl.createDiv(
            "fantasy-calendar-confirm-buttons"
        );
        new ButtonComponent(buttonEl)
            .setButtonText("Delete")
            .setCta()
            .onClick(() => {
                this.confirmed = true;
                this.close();
            });
        buttonEl.createEl("a").createEl("small", {
            cls: "dont-ask",
            text: "Cancel"
        }).onclick = () => {
            this.close();
        };
    }
    onOpen() {
        this.display();
    }
}

export class ConfirmExitModal extends Modal {
    confirmed: boolean = false;
    constructor(public plugin: FantasyCalendar) {
        super(plugin.app);
    }
    async display() {
        this.contentEl.empty();
        this.contentEl.addClass("confirm-modal");
        this.contentEl.createEl("p", {
            text: "Additional information is required to save this calendar. Any changes you may have made will be discarded if you exit now."
        });

        const buttonContainerEl = this.contentEl.createDiv(
            "fantasy-calendar-confirm-buttons-container"
        );
        buttonContainerEl.createEl("a").createEl("small", {
            cls: "dont-ask",
            text: "Exit and don't ask again"
        }).onclick = () => {
            this.confirmed = true;
            this.plugin.data.exit.saving = true;
            this.plugin.saveSettings();
            this.close();
        };

        const buttonEl = buttonContainerEl.createDiv(
            "fantasy-calendar-confirm-buttons"
        );
        new ButtonComponent(buttonEl)
            .setButtonText("Exit")
            .setCta()
            .onClick(() => {
                this.confirmed = true;
                this.close();
            });
        buttonEl.createEl("a").createEl("small", {
            cls: "dont-ask",
            text: "Keep editing"
        }).onclick = () => {
            this.close();
        };
    }
    onOpen() {
        this.display();
    }
}

export async function confirmEventDeletion(plugin: FantasyCalendar) {
    return new Promise((resolve, reject) => {
        try {
            const eventDelete = new ConfirmDeleteEventModal(plugin);
            eventDelete.onClose = () => {
                resolve(eventDelete.confirmed);
            };
            eventDelete.open();
        } catch (e) {
            reject();
        }
    });
}

class ConfirmDeleteEventModal extends Modal {
    confirmed: boolean = false;
    constructor(public plugin: FantasyCalendar) {
        super(plugin.app);
    }
    async display() {
        this.contentEl.empty();
        this.contentEl.addClass("confirm-modal");
        this.contentEl.createEl("p", {
            text: "Are you sure you wish to delete this event?"
        });

        const buttonContainerEl = this.contentEl.createDiv(
            "fantasy-calendar-confirm-buttons-container"
        );
        buttonContainerEl.createEl("a").createEl("small", {
            cls: "dont-ask",
            text: "Delete and don't ask again"
        }).onclick = () => {
            this.confirmed = true;
            this.plugin.data.exit.event = true;
            this.plugin.saveSettings();
            this.close();
        };

        const buttonEl = buttonContainerEl.createDiv(
            "fantasy-calendar-confirm-buttons"
        );
        new ButtonComponent(buttonEl)
            .setButtonText("Delete")
            .setCta()
            .onClick(() => {
                this.confirmed = true;
                this.close();
            });
        buttonEl.createEl("a").createEl("small", {
            cls: "dont-ask",
            text: "Cancel"
        }).onclick = () => {
            this.close();
        };
    }
    onOpen() {
        this.display();
    }
}
