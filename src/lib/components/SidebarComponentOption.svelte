<script lang="ts">
	import ComponentProp from '$lib/ui/ComponentProp.svelte'
	import { createEventDispatcher } from 'svelte'
	import { El, FormField, FormInput, TabContent, TabItem, TabList, TabPanel, Tabs } from 'yesvelte'

	export let components: any[] = []
	export let activeSlot: any

	const dispatch = createEventDispatcher()

	function selectSlot(slot: any) {
		dispatch('select-slot', slot)
	}

	const  getComponent = (id) => components.find(x => x.id === id);
</script>

{#if activeSlot}
<div class="sidebar-title">{getComponent(activeSlot.type)?.name ?? activeSlot.id} options</div>

<Tabs>
	<TabList>
		<TabItem>Props</TabItem>
		<TabItem>Style</TabItem>
	</TabList>
	<TabContent>
		<TabPanel p="2">
			{#each getComponent(activeSlot.type)?.fields ?? [] as field}
				{#if field.type !== 'slot'}
					<ComponentProp
						{components}
						items={{}}
						{field}
						bind:value={activeSlot.props[field.name]} />
					{:else}

					<FormField label={field.name}>
						{#each activeSlot.props[field.name] as slot}
							<El px=3 py="2" border on:click={() => selectSlot(slot.id)}>
								{getComponent(slot.type)}
							</El>
						{/each}
					</FormField>

				{/if}
			{/each}

			<El row>
				<El col></El>
			</El>
		</TabPanel>
		<TabPanel p="2">
			<El row>
				<El col>
					<FormInput label="Class" bind:value={activeSlot.props.Class} />
				</El>
			</El>
		</TabPanel>
	</TabContent>
</Tabs>
{/if}