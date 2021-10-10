import { App } from "obsidian";
import type {
    Calendar,
    Event,
    EventCategory,
    Month,
    StaticCalendarData,
    Week
} from "../src/@types";
import fs from 'fs';
import Importer from "../src/settings/import/importer";

global.createDiv = jest.fn((o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement => {
    return  document.createElement('div') as HTMLDivElement;
});

jest.mock('obsidian', () => ({
    App: jest.fn().mockImplementation()
}));

test('Test import exandria.json', () => {
    const data = fs.readFileSync('src/settings/import/exandria.json', {encoding:'utf8', flag:'r'});
    const calendars = Importer.import([JSON.parse(data)]);
})
