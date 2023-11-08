<script lang="ts">
	import { alert, modal } from '@ulibs/yesvelte'
	import { createEventDispatcher } from 'svelte'
	import { Button, El, Icon, Badge } from 'yesvelte'
	import AddPageModal from './AddPageModal.svelte'
	import { api } from '$lib/helpers/api'
	import SidebarTitleButton from './SidebarTitleButton.svelte'

	export let pages: any[] = []
	export let page: any

	export let settings = {}
	
	const dispatch = createEventDispatcher()

	async function addPage() {
		const data = await modal.open(AddPageModal, {})
		const res = await api('/pages', { data })
		alert.success(res.message)
		pages = [...pages, res.data]
		dispatch('open-page', res.data)
	}

	function gotoPageEditor(pageItem: any) {
		dispatch('open-page', pageItem)
	}

	function openPageSettings(pageItem: any) {
		dispatch('open-page-settings', pageItem)
	}
</script>

<div class="sidebar-title">
	Pages
	{#if pages.length > 0}
		<SidebarTitleButton icon="plus" on:click={addPage} />
	{/if}
</div>

{#each pages as pageItem}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->

	<div
		on:click={() => gotoPageEditor(pageItem)}
		class:active={pageItem.id === page?.id}
		class="sidebar-item">

		<div>
			{pageItem.title} <span class="opacity-50">/{pageItem.slug}</span>
		</div>
		<div class="flex items-center gap-2">
			{#if pageItem.id === settings?.page_home}
			<Badge fontSize="6" p=0 color="success">
				<Icon name="home" />
			</Badge>
			{/if}
			{#if pageItem.id === settings?.page_404}
	
			<Badge fontSize="6"  color="warning">404</Badge>
			{/if}
			
			<Icon name="pencil" class="text-gray-400" mb=1 ms="auto" on:click!stopPropagation={() => openPageSettings(pageItem)} />
		</div>
	</div>
{:else}
	<div class="w-full p-1">
		<Button w="100" color="primary" bgColor="primary" on:click={addPage}>
			<Icon name="plus" />
			Add Page
		</Button>
	</div>
{/each}
