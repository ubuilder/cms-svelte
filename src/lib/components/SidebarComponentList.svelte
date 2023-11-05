<script lang="ts">
	import { goto } from '$app/navigation'
	import { modal } from '@ulibs/yesvelte'
	import { createEventDispatcher } from 'svelte'
	import { Button, Icon, El } from 'yesvelte'
	import AddComponentModal from './components/AddComponentModal.svelte'
	import { api } from '$lib/helpers/api'

	export let components: any[] = []
	export let dragging: any
    export let activeSlot: any;
    export let mode: string;

	const dispatch = createEventDispatcher()

	function openComponentSettings(component: any) {
		dispatch('open-component-settings', component)
	}

    function getComponent(activeSlot: any) {
		dispatch('get-active-slot', activeSlot.type)
	}

    async function openAddComponentModal() {
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
                location.reload()
			})
			
		}
	}
</script>

<El class="sidebar-title">
    Components
    <Icon
        ms="auto"
        on:click={() => openAddComponentModal()}
        name="plus"
        bgColor="primary" />
</El>

{#if activeSlot}
    <Button my="2" on:click={() => (mode = 'options')} bgColor="primary"
        >{getComponent(activeSlot.type).name} Options</Button>
{/if}

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
