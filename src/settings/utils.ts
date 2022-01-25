import { Setting } from "obsidian";

export function getDetachedSetting(node: HTMLElement) {
    const setting = new Setting(node.parentElement);
    node.detach();
    return setting;
}
