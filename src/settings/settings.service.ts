import { App, PluginManifest, parseYaml, stringifyYaml } from "obsidian";
import type { Calendar, FantasyCalendarData } from "src/@types";
import { DEFAULT_DATA } from "./settings.constants";
import copy from "fast-copy";
import { nanoid } from "src/utils/functions";

const SPLITTER = "--- BEGIN DATA ---";
const HEADER = `This file is used by Fantasy Calendar to manage its data.

Please do not modify this file directly or you could corrupt the plugin data.

${SPLITTER}
`;

export default class SettingsService {
    loaded = false;

    get adapter() {
        return this.app.vault.adapter;
    }

    #data: FantasyCalendarData;
    public getData() {
        return this.#data;
    }
    public getCalendars() {
        return this.#data.calendars;
    }
    get path() {
        return this.manifest.dir + "/" + SettingsService.DataFile;
    }
    constructor(private app: App, public manifest: PluginManifest) {}
    public async saveData(data: FantasyCalendarData = this.#data) {
        this.#data = data;
        this.app.workspace.trigger("fantasy-calendar-settings-change");
        await this.guardFile();
        await this.adapter.write(this.path, this.transformData(this.#data));
    }

    public async loadData() {
        await this.guardFile();
        if (!(await this.adapter.exists(this.path))) {
            await this.saveData(copy(DEFAULT_DATA));
            return;
        }
        const contents = (await this.adapter.read(this.path))
            .split(SPLITTER)
            .pop()
            .trim();
        this.#data = parseYaml(contents);
        let dirty = false;
        for (const calendar of this.#data.calendars) {
            if (!calendar.id) {
                calendar.id = `${nanoid(10)}`;
                dirty = true;
            }
        }
        if (!this.#data.defaultCalendar && this.#data.calendars.length) {
            this.#data.defaultCalendar = this.#data.calendars[0].id;
            dirty = true;
        }
        if (
            this.#data.calendars.length &&
            !this.#data.calendars.find(
                (cal) => cal.id == this.#data.defaultCalendar
            )
        ) {
            this.#data.defaultCalendar = this.#data.calendars[0].id;
            dirty = true;
        }
        if (dirty) {
            await this.saveData();
        }
        this.loaded = true;
        this.app.workspace.trigger("fantasy-calendars-settings-loaded");
    }
    public async saveCalendars() {
        this.app.workspace.trigger("fantasy-calendars-updated");
    }
    public async loadCalendar() {}

    private transformData(data: Calendar | FantasyCalendarData) {
        return `${HEADER}\n${stringifyYaml(data)}`;
    }

    private async guardFile() {
        if (!(await this.adapter.exists(SettingsService.Folder))) {
            await this.adapter.mkdir(SettingsService.Folder);
        }
    }

    static Folder = ".obsidian/fantasy-calendar";
    static DataFile = "_data.md";
    static Path = SettingsService.Folder + "/" + SettingsService.DataFile;
    static Splitter = "--- BEGIN DATA ---";
}
