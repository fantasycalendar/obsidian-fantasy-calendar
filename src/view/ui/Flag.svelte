<script lang="ts">
    import type { Event } from "src/@types";

    export let event: Event;
</script>

<div class="flag" aria-label={event.name}>
    <span>{event.name} </span>
</div>

<style>
    .flag {
        padding-left: 0.125rem;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;

        background-color: hsl(240, 100%, 50%, 0.125);
        border: 1px solid hsla(240, 100%, 50%, 0.25);
        border-left: 2px solid blue;
    }
</style>
