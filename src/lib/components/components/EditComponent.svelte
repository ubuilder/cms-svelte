<script lang="ts">
	import { goto } from '$app/navigation'
	import CodeEditor from '$lib/components/CodeEditor.svelte'
	import ComponentFields from '$lib/components/components/ComponentFields.svelte'
	import { api } from '$lib/helpers/api'
	import { t } from '$lib/i18n/index.js'
	import SlotList from '$lib/ui/SlotList.svelte'
	import {
		Button,
		ButtonList,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		FormField,
		FormInput,
		FormSwitch,
		FormTextarea,
		Page,
		PageHeader,
		TabContent,
		TabItem,
		TabList,
		TabPanel,
		Tabs,
		Textarea,
		alert,
		confirmModal,
	} from '@ulibs/yesvelte'
	import { createEventDispatcher, onMount } from 'svelte'
  import SlotEditor from '../SlotEditor.svelte'

	export let component: any = {}

	let components: any[] = []

	async function remove() {
		const res = await confirmModal.open({ status: 'danger' })

		if (res) {
			const response = await api('/components', { params: { id: component.id }, method: 'DELETE' })
			alert.success(response.message)
	
			console.log('dispatch close')
			dispatch('close')
			dispatch('reload', ['components'])
		}
	}

	function getItems(fields: any[]) {
		const res: any = {}

		for (let field of fields) {
			res[field.name] = {
				type: field.type,
				text: field.name,
			}
		}

		return res
	}

	const dispatch = createEventDispatcher()
	async function update() {
		const res = await api('/components', {
			params: {
				id: component.id,
			},
			data: component,
		})
		alert.success(res.message)
	
		dispatch('close')
		dispatch('reload', ['components'])
	}


	function close() {
		dispatch('close')
	}
	
	onMount(async () => {
		components = await api('/components').then((res) => res.data)
	})

	let title = t('components.edit_component')
</script>

<Page>
	<PageHeader {title} slot="header">
		<Button on:click={remove} color="danger">{t('buttons.remove')}</Button>
		<Button on:click={close}>{t('buttons.cancel')}</Button>
		<Button on:click={update} color="primary">{t('buttons.update')}</Button>
	</PageHeader>

	<Card>
		<Tabs>
			<CardHeader>
				<TabList>
					<TabItem>{t('components.forms.general')}</TabItem>
					<TabItem>{t('components.forms.content')}</TabItem>
				</TabList>
			</CardHeader>
			<CardBody>
				<TabContent>
					<TabPanel>
						<FormInput bind:value={component.name} label={t('components.forms.name')} />
						<FormSwitch
							bind:checked={component.hidden}
							description="Useful when you want to use it only as child component.">
							Hide from components list
						</FormSwitch>

						<!-- after create redirect to edit page in server side -->
						<ComponentFields {components} bind:fields={component.fields} />
					</TabPanel>
					<TabPanel>
						<FormSwitch bind:checked={component.raw}>Write raw HTML</FormSwitch>
						{#if component.raw}
							<FormField label={t('components.forms.template')}>
								<Textarea
									dir="ltr"
									style="font-family: monospace;"
									rows="12"
									bind:value={component.template} />
							</FormField>
						{:else}
							<FormField label={t('components.forms.content')}>
								
								
								<!-- <SlotEditor slotList={component.slot}/> -->
							</FormField>
						{/if}
					</TabPanel>
				</TabContent>
			</CardBody>
		</Tabs>
	</Card>
</Page>
