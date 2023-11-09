<script lang="ts">
	import { goto } from '$app/navigation'
	import { alert, modal } from '@ulibs/yesvelte'
	import { createEventDispatcher } from 'svelte'
	import { Button, Icon, El, Status } from 'yesvelte'
	import AddComponentModal from './components/AddComponentModal.svelte'
	import { api } from '$lib/helpers/api'
	import SidebarTitleButton from './SidebarTitleButton.svelte'
  import type { Component } from '$lib/ui'

	export let components: any[] = []
    export let activeSlot: any = undefined;
    export let mode: string;

	const dispatch = createEventDispatcher()

	function openComponentSettings(component: any) {
		dispatch('open-component-settings', component)
	}
	function openComponentEditor(component: any) {
		dispatch('open-component-editor', component)
		console.log(component)

	}

    function getComponent(id: any) {
		return components.find(x => x.id === id)
	}

    async function addComponent() {
		const value = await modal.open(AddComponentModal, {
			data: {},
		})

		if (value?.name) {
			if (components.map((x) => x.name).includes(value.name)) {
				return
			}

			const newComponent = {
				name: value.name,
				fields: [],
				slot: [],
				raw: false,
				template: '',
			}
            
            api("/components",{data: newComponent}).then((res) => {
				// goto('.', { invalidateAll: true })
				alert.success(res.message)
				// components = [...components, res.data]

                dispatch('reload', ['components'])
			})
			
		}
	}
</script>

<El class="sidebar-title">
    Components

	{#if components.length >0}
		<SidebarTitleButton icon="plus" on:click={addComponent}/>
	{/if}
    
</El>

<div class="sidebar-body">

{#if activeSlot}
<El p="2">

    <Button w="100" on:click={() => (mode = 'options')} color="primary" bgColor="primary">
		{getComponent(activeSlot.type).name} Options
	</Button>
</El>

{/if}

{#each components as component, i}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{#if !component.global && components[i - 1].global}
		<div class="px-2 pt-3 pb-1 font-bold text-sm">Your Components</div>
	{/if}
	<div class="component-item-placeholder">
		<div
			class="component-item"
			data-draggable
			data-mode="clone"
			data-id="component-{component.id}">
			<span>{component.name}</span>
			<div class="flex items-center gap-2">
				{#if !component.global}
					{#if !component.raw}
						<Icon name="pencil" on:click!stopPropagation={(e) => openComponentEditor(component)} />
					{/if}
					<Icon name="settings" on:click!stopPropagation={(e) => openComponentSettings(component)} />
				{:else}
					<!-- <Status color="primary">Global</Status> -->
				{/if}
			</div>

		</div>
	</div>
	{:else}
	<div class="w-full p-1">
		<Button w=100 color="primary" bgColor="primary" on:click={addComponent}>
			<Icon name="plus"/>
			Add Component
		</Button>
	</div>
{/each}
</div>
