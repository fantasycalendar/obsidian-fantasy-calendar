<script lang="ts">
    import type { Moon } from "src/@types";
    import { Phase, SHADOW_MAP } from "src/utils/constants";

    export let moon: Moon;
    export let phase: Phase;

    $: path = SHADOW_MAP[phase];
</script>

<svg
    class="moon"
    id={moon.id}
    preserveAspectRatio="xMidYMid"
    aria-label={`${moon.name}\n${phase}`}
    width="28"
    height="28"
    viewBox="0 0 32 32"
>
    <circle cx="16" cy="16" r="10" fill={moon.faceColor} />
    <path class="shadow" fill={moon.shadowColor} d={path} />
    <circle
        cx="16"
        cy="16"
        r="10"
        fill="none"
        stroke="#000"
        stroke-width="2px"
    />
</svg>

<style>
</style>
