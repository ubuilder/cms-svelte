<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { El, Icon } from 'yesvelte'

	export let components: any = []
    export let level = 1

	export let slot: any
	export let activeSlot: any = null

	$: component = components.find((x) => x.id === slot.type)
	// $: fields = getComponent(activeSlot.type).fields

    const dispatch = createEventDispatcher()

    function openSettings() {
        dispatch('open-settings', slot)
    }

	function removeSlot() {
        dispatch('remove-slot', slot)
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    on:click={() => activeSlot = slot}

	class="sidebar-item"
	class:active={slot === activeSlot}
	style="padding-left: {level * 16 + 'px'}; padding-right: 8px"
>
    
    <span>{component.name}</span>
	
	<div class="flex items-center gap-2">
		<Icon name="pencil" class="text-gray-400 hover:text-gray-200" mb=1 on:click={() => openSettings()}/>
		<Icon name="trash" class="text-red-400 hover:text-red-200" mb=1 on:click={() => removeSlot()} />
	</div>
	
</div>

{#each component.fields ?? [] as field}
	{#if field.type === 'slot' && Array.isArray(slot.props[field.name] ?? [])}
	{#each slot.props[field.name] ?? [] as slotItem}
	<svelte:self on:open-settings on:remove-slot {components} slot={slotItem} level={level + 1} bind:activeSlot />
	<!-- <El
		borderBottom
		borderColor="secondary"
		style="padding-left: {activeSlot.parent_id ? '48px' : '32px'};"
		py="1"
		on:click={() => selectSlot(slotItem.id)}
		>{getComponent(slotItem.type).name} ({field.name})</El> -->
{/each}
	{/if}
{/each}
