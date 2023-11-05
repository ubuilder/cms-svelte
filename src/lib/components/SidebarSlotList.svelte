<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Icon } from 'yesvelte'
	import SlotSidebarItem from './SlotSidebarItem.svelte'

	export let slots: any[] = []
	export let components: any
	export let activeSlot: any

</script>

<div class=" sidebar-title">Slots</div>
{#each slots as slot}
	<SlotSidebarItem on:open-settings {components} {slot} bind:activeSlot />
{/each}
