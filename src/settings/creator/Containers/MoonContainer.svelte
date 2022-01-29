<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Calendar, Moon } from "src/@types";
    import { ButtonComponent, ExtraButtonComponent, Setting } from "obsidian";
    import MoonSVG from "src/view/ui/Moon.svelte";
    import AddNew from "../Utilities/AddNew.svelte";
    import NoExistingItems from "../Utilities/NoExistingItems.svelte";
    import ToggleComponent from "../Settings/ToggleComponent.svelte";
    import { CreateMoonModal } from "src/settings/modals/moons";
    import type FantasyCalendar from "src/main";

    export let calendar: Calendar;
    export let plugin: FantasyCalendar;

    $: moons = calendar.static.moons;
    $: displayMoons = calendar.static.displayMoons;

    const dispatch = createEventDispatcher();

    const trash = (node: HTMLElement) => {
        let b = new ExtraButtonComponent(node)
            .setIcon("trash")
            .setTooltip("Delete");
    };
    const edit = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("pencil").setTooltip("Edit");
    };
    const deleteMoon = (item: Moon) => {
        calendar.static.moons = calendar.static.moons.filter(
            (moon) => moon.id !== item.id
        );
    };

    const add = (moon?: Moon) => {
        const modal = new CreateMoonModal(plugin.app, calendar, moon);
        modal.onClose = () => {
            if (!modal.saved) return;
            if (modal.editing) {
                const index = calendar.static.moons.findIndex(
                    (e) => e.id === modal.moon.id
                );

                calendar.static.moons.splice(index, 1, {
                    ...modal.moon
                });
            } else {
                calendar.static.moons.push({ ...modal.moon });
            }
            moons = calendar.static.moons;
        };
        modal.open();
    };
</script>

<ToggleComponent
    name={"Display Moons"}
    desc={"Display moons by default when viewing this calendar."}
    value={displayMoons}
    on:click={() =>
        (calendar.static.displayMoons = !calendar.static.displayMoons)}
/>

<AddNew on:click={() => add()} />

{#if !moons.length}
    <NoExistingItems message={"Create a new moon to see it here."} />
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
