
<script lang="ts">
	import { createEventDispatcher } from "svelte"


	import { Icon } from "yesvelte"

    export let tables: any[] =[]

    const dispatch = createEventDispatcher()


    function openTableData(tableItem: any) {
        dispatch('open-table-data', tableItem)
    }

    function openTableSettings(tableItem: any) {
        dispatch('open-table-settings', tableItem)
    }


</script>
<div class="sidebar-title">
    Tables
</div>
{#each tables as tableItem}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        on:click={() => openTableData(tableItem)}
        class="sidebar-item">
        {tableItem.name}
        <Icon
            name="settings"
            ms="auto"
            on:click!stopPropagation={() => openTableSettings(tableItem)} />
    </div>
{/each}