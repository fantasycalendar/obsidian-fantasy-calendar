<script lang="ts">
    import Nav from "./Nav.svelte";
    import Month from "./Month.svelte";
    import { ExtraButtonComponent, Menu } from "obsidian";
    import { getTypedContext } from "../view";
    import DayView from "./DayView.svelte";
    import { ViewState } from "src/stores/calendar.store";
    import Year from "./Year/Year.svelte";
    import Week from "./Week/Week.svelte";

    const global = getTypedContext("store");
    const ephemeral = getTypedContext("ephemeralStore");
    $: store = $global;
    $: displaying = ephemeral.displaying;
    $: viewState = ephemeral.viewState;

    $: viewing = ephemeral.viewing;

    const plugin = getTypedContext("plugin");
    let otherCalendars = plugin.data.calendars;

    //don't like this... find a better way
    plugin.app.workspace.on(
        "fantasy-calendars-updated",
        () => (otherCalendars = plugin.data.calendars)
    );

    const drop = (node: HTMLElement) => {
        new ExtraButtonComponent(node).setIcon("chevrons-up-down");
    };
    const showMenu = (evt: MouseEvent) => {
        const menu = new Menu();
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
    <div class="top-container">
        <div class="name-container">
            <h3 class="calendar-name">{$store.name}</h3>
            {#if otherCalendars.length > 1}
                <div use:drop on:click={(evt) => showMenu(evt)} />
            {/if}
        </div>
        <Nav />
    </div>
    {#if $viewState == ViewState.Year}
        <Year />
    {:else if $viewState == ViewState.Month}
        {#key $displaying}
            <Month year={$displaying.year} month={$displaying.month} />
        {/key}
    {:else if $viewState == ViewState.Week}
        <Week />
    {:else if $viewState == ViewState.Day}
        <DayView />
    {/if}
    {#if $viewing}
        <hr />
        <DayView />
    {/if}
{/key}

<style scoped>
    .top-container {
        display: flex;
        flex-flow: column;
        gap: 0.5rem;
    }
    .name-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .calendar-name {
        margin: 0;
    }
</style>
