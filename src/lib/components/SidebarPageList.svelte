<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Icon } from 'yesvelte'

	export let pages: any[] = []
	export let page: any

	const dispatch = createEventDispatcher()

	function gotoPageEditor(pageItem: any) {
		dispatch('open-page', pageItem)
	}

	function openPageSettings(pageItem: any) {
		dispatch('open-page-settings', pageItem)
	}
</script>
<div class="sidebar-title">
    Pages
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
