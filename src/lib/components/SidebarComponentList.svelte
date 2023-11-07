<script lang="ts">
	import { goto } from '$app/navigation'
	import { modal } from '@ulibs/yesvelte'
	import { createEventDispatcher } from 'svelte'
	import { Button, Icon, El } from 'yesvelte'
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
            
            api("/components",{data: newComponent}).then(() => {
				// goto('.', { invalidateAll: true })
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

{#if activeSlot}
<El p="2">

    <Button w="100" on:click={() => (mode = 'options')} bgColor="primary">
		{getComponent(activeSlot.type).name} Options
	</Button>
</El>

{/if}

{#each components as component}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="component-item-placeholder">
		<div
			class="component-item"
			data-draggable
			data-mode="clone"
			data-id="component-{component.id}">
			<span>{component.name}</span>
			<div class="flex items-center gap-2">
				{#if !component.raw}
					<Icon name="pencil" on:click!stopPropagation={(e) => openComponentEditor(component)} />
				{/if}
				<Icon name="settings" on:click!stopPropagation={(e) => openComponentSettings(component)} />

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
