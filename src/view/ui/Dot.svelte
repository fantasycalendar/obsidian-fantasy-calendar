<script lang="ts">
    export let isFilled: boolean = true;
    export let isActive: boolean = false;
    export let color: string;
</script>

<svg
    class="dot"
    class:filled={isFilled}
    class:active={isActive}
    viewBox="0 0 6 6"
    xmlns="http://www.w3.org/2000/svg"
>
    <circle
        stroke={color ?? "currentColor"}
        fill={color ?? "currentColor"}
        cx="3"
        cy="3"
        r="2"
    />
</svg>

<style>
    .dot {
        display: inline-block;
        height: 6px;
        width: 6px;
        margin: 0 1px;
    }
    .active {
        color: var(--text-on-accent);
    }
</style>
