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
	} from '@ulibs/yesvelte'
	import SlotList from '$lib/ui/SlotList.svelte'
	import { writable } from 'svelte/store'
	import PageLoad from '$lib/components/pages/PageLoad.svelte'
	import { slots } from '$lib/stores/pageSlots'
	import DynamicFormField from '$lib/components/content/DynamicFormField.svelte'
	import { t } from '$lib/i18n'
	import FormViewer from './FormViewer.svelte'
	import { createEventDispatcher } from 'svelte'

	export let page: Partial<PageType> = {};
	export let tables: Table[] = [];
	export let forms: any[] = [];
	export let components: any[] = [];


	async function openRemoveConfirmModal() {
		const res = await confirmModal.open({ status: 'danger' }, { autoClose: true })
		if (res) {
			dispatch('remove')

		}
	}
	const dispatch = createEventDispatcher()

	function updatePage() {
		dispatch('update')
	}
	function cancel() {
		dispatch('cancel')
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
		}
		console.log(items)

		console.log('load: ', load)
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
</script>

<Page>
	<ButtonList slot="header-buttons">
		<!-- <Button on:click={() => history.back()}>
			<Icon name="chevron-left" />
			Back
		</Button>
		 -->
		 <Button on:click={openRemoveConfirmModal} color="danger">
			{t('buttons.remove')}
		</Button>
		<Button on:click={cancel}>{t('buttons.cancel')}</Button>
		<Button on:click={updatePage} color="primary">{t('buttons.save')}</Button>
	
		<!-- <Button on:click={openPreviewModal} color="primary">Preview</Button> -->
		<!-- <Button href="/editor/{data.page.id}" color="success">Edit</Button> -->
	</ButtonList>

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
							<PageLoad
								items={getItems(page.load)}
								bind:load={page.load}
								bind:tables />
						</TabPanel>
						<!-- <TabPanel>
							<SlotList
								components={data.components}
								items={getItems(page.load)}
								on:move={onMove}
								bind:slotList={page.slot} />
						</TabPanel> -->
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
							{#if forms.data.length}
								<ListBox items={forms.data} let:item>
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
