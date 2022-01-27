<script lang="ts">
    export let name: string;
    export let desc = "";
    export let value: string;
    export let placeholder: string = name;
    export let options: Record<string, string> = {};
</script>

<div class="setting-item">
    <div class="setting-item-info">
        <div class="setting-item-name">{name}</div>
        <div class="setting-item-description">
            {desc}
        </div>
    </div>
    <div class="setting-item-control">
        <select class="dropdown"
            ><option value="0">Sunday</option><option value="1">Monday</option
            ><option value="2">Tuesday</option><option value="3"
                >Wednesday</option
            ><option value="4">Thursday</option><option value="5">Friday</option
            ><option value="6">Saturday</option></select
        >
    </div>
</div>
