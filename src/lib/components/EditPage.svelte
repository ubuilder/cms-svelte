<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import type { FieldRelation, Page as PageType, Table } from '$lib/types'
	import {
		Page,
		modal,
		Button,
		FormField,
		El,
		FormInput,
		Tabs,
		TabList,
		TabItem,
		TabContent,
		TabPanel,
		FormTextarea,
		alert,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		Icon,
		FormRadioGroup,
		ButtonList,
		confirmModal,
		Accordions,
		Accordion,
		AccordionHeader,
		AccordionBody,
		ListBox,
		ListItem,
    PageHeader,
	} from '@ulibs/yesvelte'
	import SlotList from '$lib/ui/SlotList.svelte'
	import { writable } from 'svelte/store'
	import PageLoad from '$lib/components/pages/PageLoad.svelte'
	import { slots } from '$lib/stores/pageSlots'
	import DynamicFormField from '$lib/components/content/DynamicFormField.svelte'
	import { t } from '$lib/i18n'
	import FormViewer from './FormViewer.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import { api } from '$lib/helpers/api'

	export let page: Partial<PageType> = {};
	
	let tables: Table[] = [];
	let forms: any[] = [];


	async function openRemoveConfirmModal() {
		const res = await confirmModal.open({ status: 'danger' }, { autoClose: true })
		if (res) {
			const res = await api('/pages', {
				params: {
					id: page.id
				},
				method: 'DELETE'
			})
			alert.success(res.message)		
			dispatch('close')
			dispatch('reload', ['pages'])

		}
	}
	const dispatch = createEventDispatcher()

	async function updatePage() {
		const res = await api('/pages', {
			params: {
				id: page.id
			},
			data: page
		})
		alert.success(res.message)		
	}
	function cancel() {
		dispatch('close')

	}

	function getItems(load: any): any[] {
		let params = page.slug?.match(/\{\w+\}/g)

		let items: any = {
			page: {
				text: 'Page',
				type: 'object',
				content: {
					slug: {
						text: "Page's Slug",
						type: 'plain_text',
					},
					params: {
						type: 'object',
						text: "Page's URL params",
						content: params?.reduce((prev, curr) => {
							const key = curr.substring(1, curr.length - 1)
							return {
								...prev,
								[key]: {
									text: "Page's param (" + key + ')',
									type: 'plain_text',
								},
							}
						}, {}),
					},
					title: {
						text: "Page's Title",
						type: 'plain_text',
					},
					description: {
						text: "Page's Description",
						type: 'plain_text',
					},
				},
			},
			// todos: {
			// 	type: 'array' | 'object',
			// 	text: "todos",
			// 	content: {
			// 		id: {
			// 			type,
			// 			text
			// 		},
			// 		Text: {
			// 			type: string,
			// 			text: 'Text'
			// 		}
			// 	}
			// }
		}

		// const items = {
		// 	page: {
		// 		slug: '//',
		// 		params: {
		// 			[x]: string
		// 		},
		// 		title: 'string',
		// 		description: 'string'
		// 	},
		// 	todos: [{}, {}]

		// }
		
		
		for (let item of load) {
			const table = tables.find((x) => x.id === item.table)
			if (!table) continue

			const fields: any = {}
			fields.id = {
				text: 'ID',
				type: 'plain_text'
			}
			for (let field of table.fields) {
				fields[field.name] = {
					text: `${item.name}'s ${field.name}`,
					type: field.type,
				}

				if (field.type === 'relation') {
					const otherTable = tables.find((x) => x.id === (field as FieldRelation).table)
					const otherFields: any = {}
					for (let otherField of otherTable.fields) {
						otherFields[otherField.name] = {
							text: `${item.name} ${field.name} ${otherField.name}`,
							type: otherField.type,
						}
					}

					fields[field.name].content = otherFields
					fields[field.name].type = field.multiple ? 'array' : 'object'
				}

				if (field.type === 'image' || field.type === 'file') {
					// alt, url, caption from assets....
				}
			}

			items[item.name] = {
				type: item.multiple ? 'array' : 'object',
				text: item.name,
				content: fields,
			}
		}

		console.log(items)
		return items
	}

	onMount(async () => {
		tables = await api('/tables').then(res => res.data)
		forms = await api('/pages/forms', {params: {id: page.id}}).then(res => res.data)
		// actions = await api('/actions').then(res => res.data)
	})

</script>

<Page>
	<PageHeader title="Edit Page" slot="header">
		<Button on:click={openRemoveConfirmModal} color="danger">
			{t('buttons.remove')}
		</Button>
		<Button on:click={cancel}>{t('buttons.cancel')}</Button>
		<Button on:click={updatePage} color="primary">{t('buttons.save')}</Button>
	</PageHeader>

	<El row>
		<Tabs>
			<Card>
				<CardHeader>
					<TabList>
						<TabItem>General</TabItem>
						<TabItem>Load</TabItem>
						<!-- <TabItem>Content</TabItem> -->
						<TabItem>Actions</TabItem>
						<TabItem>Forms</TabItem>
					</TabList>
				</CardHeader>

				<TabContent>
					<CardBody>
						<TabPanel>
							<FormInput bind:value={page.slug} label="Slug" />

							<DynamicFormField
								items={getItems(page.load)}
								type="plain_text"
								bind:value={page.title}
								label="Title" />
							<DynamicFormField
								items={getItems(page.load)}
								type="plain_text"
								input_type="textarea"
								label="Description"
								bind:value={page.description} />
							<DynamicFormField
								dir="ltr"
								items={getItems(page.load)}
								type="plain_text"
								input_type="textarea"
								label="Head"
								bind:value={page.head} />

							<DynamicFormField
								type="select"
								items={getItems(page.load)}
								input_type="radio_group"
								options={[
									{ key: 'rtl', text: 'Right to left' },
									{ key: 'ltr', text: 'Left to right' },
								]}
								bind:value={page.dir}
								label="Direction" />
						</TabPanel>
						<TabPanel>
							{#if tables.length}
							<PageLoad
								items={getItems(page.load)}
								bind:load={page.load}
								bind:tables />
							{/if}
						</TabPanel>
						
						<TabPanel>
							<FormField label="Actions">
								<Accordions>
									{#each page.actions as action}
										<Accordion>
											<AccordionHeader>
												{action.name}
											</AccordionHeader>
											<AccordionBody>
												<El row>
													<FormInput colMd="6" label="Name" bind:value={action.name} />
													<FormInput colMd="6" label="Slug" bind:value={action.slug} />

													<FormInput label="Url" bind:value={action.url} />
													<FormTextarea rows="8" label="Body (JSON)" bind:value={action.body} />

													<El col d="flex">

													<ButtonList ms="auto">
													<Button
														on:click={() =>
															(page.actions = page.actions.filter((x) => x !== action))}
														color="danger">Remove</Button>
													</ButtonList>
												</El>

												</El>
											</AccordionBody>
										</Accordion>
									{/each}
								</Accordions>
							</FormField>

							<Button
								color="primary"
								mt="2"
								on:click={() => (page.actions = [...(page.actions ?? []), {}])}>
								<Icon name="plus" />
								Add Action
							</Button>
						</TabPanel>
						<TabPanel>
							{#if forms.length}
								<ListBox items={forms} let:item>
									<!-- <ListItem name="Form">{item.}</ListItem> -->
									<ListItem name="URL">{item.pathname}</ListItem>
									<ListItem name="Content (JSON)"
										>{JSON.stringify(item.data).slice(0, 50) + '...'}</ListItem>
									<ListItem name="Created At">{item.created_at}</ListItem>

									<ListItem name="Actions">
										<Button
											on:click={() => modal.open(FormViewer, { data: item.data })}
											color="primary"
											size="sm">View</Button>
									</ListItem>
								</ListBox>
							{:else}
								<El style="height: 300px" d="flex" alignItems="center" justifyContent="center">
									There is no form submitted from this page!
								</El>
							{/if}
						</TabPanel>
					</CardBody>
				
				</TabContent>
			</Card>
		</Tabs>
	</El>
</Page>

<style>
	:global(.y-el-p-0 .y-accordion-body-inner) {
		padding: 0;
	}
	:global(.y-el-p-0 .y-accordion-header-button) {
		padding: 0;
	}
	:global(.y-accordion-header-button::after) {
		content: unset;
	}
</style>
