<script lang="ts">
	import { alert, modal } from '@ulibs/yesvelte'
	import { createEventDispatcher } from 'svelte'
	import { Button, El, Icon } from 'yesvelte'
	import AddPageModal from './AddPageModal.svelte'
	import { api } from '$lib/helpers/api'
	import SidebarTitleButton from './SidebarTitleButton.svelte'

	export let pages: any[] = []
	export let page: any

	const dispatch = createEventDispatcher()

	async function addPage() {
		const data = await modal.open(AddPageModal, {

		})

		const res = await api('/pages', {data})

		alert.success(res.message)
		dispatch('open-page', res.data);
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
	<SidebarTitleButton icon="plus" on:click={addPage}/>
</div>

{#each pages as pageItem}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->

	<div
		on:click={() => gotoPageEditor(pageItem)}
		class:active={pageItem.id === page.id}
		class="sidebar-item">
		<div>
			{pageItem.title} <span class="opacity-50">/{pageItem.slug}</span>
		</div>
		<Icon name="settings" ms="auto" on:click!stopPropagation={() => openPageSettings(pageItem)} />
	</div>
{/each}
