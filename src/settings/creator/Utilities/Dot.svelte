<script lang="ts">
    export let color: string;
    export let label: string;
</script>

<svg
    class="dot"
    viewBox="0 0 6 6"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={label}
>
    <circle stroke={color} fill={color} cx="3" cy="3" r="2" />
</svg>

<style>
    .dot {
        display: inline-block;

        height: 0.875em;
        width: 0.875em;
        margin: 0 1px;
    }
</style>
