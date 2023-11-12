<script lang="ts">
	import { modal } from '@ulibs/yesvelte'
	import { createEventDispatcher, onMount } from 'svelte'

	import { Button, Icon } from 'yesvelte'
	import SidebarTitleButton from './SidebarTitleButton.svelte'
	import { api } from '$lib/helpers/api'

	export let tables: any[] = []

	const dispatch = createEventDispatcher()
	function addTable() {
		dispatch('open-table-create')
	}

	function openTableData(tableItem: any) {
		dispatch('open-table-data', tableItem)
	}

	function openTableSettings(tableItem: any) {
		dispatch('open-table-settings', tableItem)
	}
</script>

<div class="sidebar-title">
	Tables
	{#if tables.length > 0}
		<SidebarTitleButton icon="plus" on:click={addTable} />
	{/if}
</div>
{#each tables as tableItem}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click={() => openTableData(tableItem)} class="sidebar-item">
		{tableItem.name}
		<Icon name="settings" ms="auto" on:click!stopPropagation={() => openTableSettings(tableItem)} />
	</div>
{:else}
	<div class="w-full p-1">
		<Button w="100" color="primary" bgColor="primary" on:click={addTable}>
			<Icon name="plus" />
			Add Table
		</Button>
	</div>
{/each}
