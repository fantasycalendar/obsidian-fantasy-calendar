<script lang="ts">
    export let message: string;
</script>

<div class="no-existing-items setting-item">
    <span>{message}</span>
</div>

<style>
    .no-existing-items {
        width: 100%;
    }
    .no-existing-items span {
        width: 100%;
        text-align: center;
        color: var(--text-faint);
    }
</style>
