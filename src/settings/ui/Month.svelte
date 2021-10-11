<script lang="ts">
    import {
        debounce,
        DropdownComponent,
        ExtraButtonComponent,
        Notice,
        setIcon,
        TextComponent
    } from "obsidian";
    import type { Month } from "src/@types";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let month: Month;

    let name = month.name;
    let type = month.type;
    let length = month.length;

    const trash = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("trash").onClick(() => {
            dispatch("month-delete");
        });
    };

    /*     const name = (node: HTMLElement) => {
        const comp = new TextComponent(node)
            .setValue(month.name)
            .setPlaceholder("Name")
            .onChange((v) => {
                month.name = v;
                dispatch("month-update");
            });
        comp.inputEl.setAttr("style", "width: 100%;");
    }; */

    /*     const length = (node: HTMLElement) => {
        const comp = new TextComponent(node)
            .setValue(`${month.length}`)
            .setPlaceholder("Length")
            .setDisabled(month.type == "intercalary")
            .onChange(
                debounce(
                    (v) => {
                        if (isNaN(Number(v)) || Number(v) < 0) {
                            new Notice(
                                "Month length must be a positive number."
                            );
                            comp.inputEl.value = null;
                            return;
                        }
                        month.length = Number(v);
                        dispatch("month-update");
                    },
                    500,
                    true
                )
            );
        comp.inputEl.setAttr("style", "width: 100%;");
        comp.inputEl.setAttrs({ type: "number", min: "0" });

        if (month.type == "intercalary") {
            console.log("🚀 ~ file: Months.svelte ~ line 79 ~ month", month);
            comp.inputEl.setAttr(
                "aria-label",
                "Intercalary Months can only be 1 day long."
            );
        }
    }; */

    /*     const type = (node: HTMLElement) => {
        new DropdownComponent(node)
            .addOption("month", "Month")
            .addOption("intercalary", "Intercalary")
            .setValue(month.type)
            .onChange((v) => {
                month.type = v;
                if (v == "intercalary") {
                    month.length = 1;
                }
                dispatch("month-update");
            });
    }; */

    $: {
        month.name = name;
    }
    $: {
        month.type = type;
        if (type == "intercalary") {
            length = 1;
        }
    }
    $: {
        month.length = length;
    }
</script>

<div class="month">
    <input
        type="text"
        spellcheck="false"
        value={name}
        placeholder="Name"
        style="width: 100%;"
    />
    <input
        type="number"
        spellcheck="false"
        placeholder="Length"
        value={length}
        disabled={month.type == "intercalary"}
        style="width: 100%;"
        min="0"
    />
    <select class="dropdown" bind:value={type}>
        <option value="month">Month</option>
        <option value="intercalary">Intercalary</option>
    </select>

    <div class="icon" use:trash />
</div>

<style>
    .month {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .month .icon {
        align-items: center;
    }
</style>
