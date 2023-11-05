<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Icon } from 'yesvelte'

	export let components: any[] = []
	export let dragging: any

	const dispatch = createEventDispatcher()

	function openComponentSettings(component: any) {
		dispatch('open-component-settings', component)
	}
</script>

{#each components as component}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="component-item-placeholder">
		<div
			class="component-item"
			data-draggable
			data-mode="clone"
			data-id="component-{component.id}"
			on:mousedown={() => (dragging = true)}>
			<span>{component.name}</span>
			<Icon name="settings" on:click!stopPropagation={(e) => openComponentSettings(component)} />
		</div>
	</div>
{/each}
