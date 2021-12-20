import { App, PluginManifest } from "obsidian";
import fs from 'fs';
import Importer from '../src/settings/import/importer';
import FantasyCalendar from '../src/main';
import FantasyCalendarSettings from '../src/settings/settings';

jest.mock('obsidian', () => ({
    App: jest.fn().mockImplementation(),
    PluginManifest: jest.fn().mockImplementation()
}));

jest.mock('../src/main');

class DummyPluginManifest implements PluginManifest {
    dir?: string;
    id: string;
    name: string;
    author: string;
    version: string;
    minAppVersion: string;
    description: string;
    authorUrl?: string;
    isDesktopOnly?: boolean;
}

global.createDiv = jest.fn((o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement => {
    return  document.createElement('div') as HTMLDivElement;
});

test('Test import exandria.json', () => {
    const data = fs.readFileSync('src/settings/import/exandria.json', {encoding:'utf8', flag:'r'});
    const calendars = Importer.import([JSON.parse(data)]);
})

test('Test import harptos-custom-export.json', () => {
    const data = fs.readFileSync('test/harptos-custom-export.json', {encoding:'utf8', flag:'r'});
    const calendars = Importer.import([JSON.parse(data)]);
    console.log(calendars);
    
    const settings = new FantasyCalendarSettings(new FantasyCalendar(new App(), new DummyPluginManifest()));
    const root = createDiv("existing-calendars");
    
})
