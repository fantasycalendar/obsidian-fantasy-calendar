<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";

    import type { Calendar, Moon } from "src/@types";
    import { ButtonComponent, ExtraButtonComponent, Setting } from "obsidian";
    import MoonSVG from "src/view/ui/Moon.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import ToggleComponent from "../Settings/ToggleComponent.svelte";
    import { CreateMoonModal } from "src/settings/modals/moons";
    import type FantasyCalendar from "src/main";
    import Details from "../Utilities/Details.svelte";

    export let plugin: FantasyCalendar;

    const calendar = getContext("store");
    const { moonStore, displayMoons } = calendar;

    const trash = (node: HTMLElement) => {
        let b = new ExtraButtonComponent(node)
            .setIcon("trash")
            .setTooltip("Delete");
    };
    const edit = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("pencil").setTooltip("Edit");
    };
    const deleteMoon = (item: Moon) => {
        moonStore.delete(item.id);
    };

    const add = (moon?: Moon) => {
        const modal = new CreateMoonModal(plugin.app, $calendar, moon);
        modal.onClose = () => {
            if (!modal.saved) return;
            if (modal.editing) {
                moonStore.update(moon.id, { ...modal.moon });
            } else {
                moonStore.add({ ...modal.moon });
            }
        };
        modal.open();
    };
</script>

<Details
    name={"Moons"}
    open={false}
    desc={`${$moonStore.length} moon${$moonStore.length != 1 ? "s" : ""}`}
>
    <ToggleComponent
        name={"Display Moons"}
        desc={"Display moons by default when viewing this calendar."}
        value={$displayMoons}
        on:click={() => ($displayMoons = !$displayMoons)}
    />

    <AddNew on:click={() => add()} />

    {#if !$moonStore.length}
        <NoExistingItems message={"Create a new moon to see it here."} />
    {:else}
        <div class="existing-items">
            {#each $moonStore as moon}
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
                                <span>
                                    Cycle: {moon.cycle} days
                                </span>
                                {#if moon.offset}
                                    <span>
                                        , offset: {moon.offset} days
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="icons">
                        <div class="icon" use:edit on:click={() => add(moon)} />
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
</Details>

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
