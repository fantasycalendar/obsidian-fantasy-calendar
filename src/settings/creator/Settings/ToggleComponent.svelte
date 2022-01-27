<script lang="ts">
    export let name: string;
    export let desc: string = "";
    export let value: boolean;
</script>

<div class="setting-item mod-toggle">
    <div class="setting-item-info">
        <div class="setting-item-name">{name}</div>
        <div class="setting-item-description">{desc}</div>
    </div>
    <div class="setting-item-control">
        <div class="checkbox-container" class:is-enabled={value} on:click />
    </div>
</div>
