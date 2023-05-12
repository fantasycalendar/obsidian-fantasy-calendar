<script lang="ts">
    import { getTypedContext } from "../view";
    import Dot from "./Dot.svelte";
    import type { FcEvent, FcEventCategory } from "src/@types";

    export let events: FcEvent[] = [];

    const store = getTypedContext("store");
    const { categories } = $store;

    let overflow: number = 0;

    let dotContainer: HTMLDivElement;
    let previousWidth = 0;
    const addEvents = (dots: HTMLDivElement) => {
        dotContainer = dots;
        if (events.length) {
            const width = dots.parentElement?.getBoundingClientRect()?.width;
            if (!width || Math.floor(width) == Math.floor(previousWidth))
                return;
            previousWidth = width;
            let remaining = width;
            dots.empty();
            overflow = 0;

            for (const event of events) {
                new Dot({
                    target: dots,
                    props: {
                        color: color(event),
                    },
                });
                remaining = width - dots.getBoundingClientRect().width;

                if (remaining < 0) {
                    dots.lastElementChild.detach();
                    overflow = events.length - events.indexOf(event);
                    break;
                } else if (remaining == 0) {
                    overflow = events.length - events.indexOf(event) - 1;
                    break;
                }
            }
        }
    };

    const color = (event: FcEvent) => {
        return $categories.find((c) => c.id == event.category)?.color;
    };
</script>

<div class="dots-container">
    {#key events}
        <div class="dot-container centered" use:addEvents />
    {/key}
    <div class="overflow">
        {#if overflow > 0}
            <span>+{overflow}</span>
        {/if}
    </div>
</div>

<style>
    .dots-container {
        width: 100%;
    }
    .dot-container {
        display: flex;
        flex-flow: row nowrap;
        width: fit-content;
        margin: auto;
        line-height: 6px;
        min-height: 6px;
    }
    .centered {
        justify-content: center;
        align-items: center;
    }
    .overflow {
        color: var(--text-muted);
        font-size: xx-small;
        display: flex;
        justify-content: flex-end;
        width: 100%;
        line-height: 1.25;
    }
</style>
