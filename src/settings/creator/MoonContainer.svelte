<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Calendar, Moon } from "src/@types";
    import { ButtonComponent, ExtraButtonComponent, Setting } from "obsidian";
    import MoonSVG from "src/view/ui/Moon.svelte";

    export let calendar: Calendar;

    $: moons = calendar.static.moons;
    $: displayMoons = calendar.static.displayMoons;

    const dispatch = createEventDispatcher();

    const display = (node: HTMLElement) => {
        new Setting(node)
            .setName("Display Moons")
            .setDesc("Display moons by default when viewing this calendar.")
            .addToggle((t) => {
                t.setValue(displayMoons).onChange((v) =>
                    dispatch("display-toggle", v)
                );
            });
    };

    const trash = (node: HTMLElement) => {
        let b = new ExtraButtonComponent(node)
            .setIcon("trash")
            .setTooltip("Delete");
        b.extraSettingsEl.setAttr("style", "margin-left: 0;");
    };
    const edit = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("pencil").setTooltip("Edit");
    };
    const deleteMoon = (item: Moon) => {
        moons = moons.filter((moon) => moon.id !== item.id);
        dispatch("edit-moons", moons);
    };
    const add = (node: HTMLElement) => {
        new ButtonComponent(node)
            .setTooltip("Add New")
            .setButtonText("+")
            .onClick(async () => {
                /* calendar.categories = [
                    ...categories,
                    {
                        id: nanoid(6),
                        color: DEFAULT_CATEGORY_COLOR,
                        name: "Category"
                    }
                ]; */
            }).buttonEl.style.width = "100%";
    };
</script>

<div use:display />
<div>
    <div class="add-new" use:add />
</div>
{#if !moons.length}
    <div class="existing-items">
        <span>Create a new moon to see it here.</span>
    </div>
{:else}
    <div class="existing-items">
        {#each moons as moon}
            <div class="moon">
                <div class="moon-info">
                    <span class="setting-item-name">
                        <MoonSVG
                            {moon}
                            phase={"First Quarter"}
                            label={false}
                            size={20}
                        />
                        {moon.name}
                    </span>
                    <div class="setting-item-description">
                        <div class="date">
                            Cycle: {moon.cycle} days
                        </div>
                    </div>
                </div>
                <div class="icons">
                    <div
                        class="icon"
                        use:edit
                        on:click={() => dispatch("new-item", moon)}
                    />
                    <div
                        class="icon"
                        use:trash
                        on:click={() => deleteMoon(moon)}
                    />
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    .moon {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    .setting-item-name {
        display: flex;
        align-items: center;
    }
    .icons {
        display: flex;
        align-self: flex-start;
        justify-self: flex-end;
        align-items: center;
    }
    .icon {
        align-items: center;
    }
</style>
