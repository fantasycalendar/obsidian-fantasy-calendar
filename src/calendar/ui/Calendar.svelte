<script lang="ts">
    import type { CalendarStore } from "src/stores/calendar.store";
    import Nav from "./Nav.svelte";
    import Month from "./Month.svelte";
    import { ExtraButtonComponent, Menu } from "obsidian";
    import { getTypedContext } from "../view";

    const global = getTypedContext("store");
    $: store = $global;
    $: displaying = store.displaying;
    const plugin = getTypedContext("plugin");
    $: otherCalendars = plugin.data.calendars;
    const drop = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("chevrons-up-down");
    };
    const showMenu = (evt: MouseEvent) => {
        const menu = new Menu(plugin.app);
        for (const calendar of plugin.data.calendars.filter(
            (c) => c.id != $store.id
        )) {
            menu.addItem((item) =>
                item.setTitle(calendar.name).onClick(() => {
                    const newStore = plugin.getStore(calendar);
                    global.set(newStore);
                })
            );
        }
        menu.showAtMouseEvent(evt);
    };
</script>

{#key $store}
    <div class="name-container">
        <h3 class="calendar-name">{$store.name}</h3>
        {#if otherCalendars.length > 1}
            <div use:drop on:click={(evt) => showMenu(evt)} />
        {/if}
    </div>
    <Nav />
    <Month year={$displaying.year} month={$displaying.month}/>
{/key}

<style scoped>
    .name-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .calendar-name {
        margin: 0;
    }
</style>
