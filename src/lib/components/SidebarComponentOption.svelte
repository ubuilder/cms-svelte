<script lang="ts">
	import ComponentProp from '$lib/ui/ComponentProp.svelte'
	import { createEventDispatcher } from 'svelte'
	import { El, FormInput, TabContent, TabItem, TabList, TabPanel, Tabs } from 'yesvelte'

	export let components: any[] = []
	export let activeSlot: any

	const dispatch = createEventDispatcher()

	function getComponent(activeSlot: any) {
		dispatch('get-active-slot', activeSlot.type)
	}

</script>

<div class="sidebar-title">{getComponent(activeSlot.type).name} options</div>

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
