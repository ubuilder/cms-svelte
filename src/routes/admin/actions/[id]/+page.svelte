<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import type { FieldRelation, Page as PageType } from '$lib/types'
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
	} from '@ulibs/yesvelte'
	import { t } from '$lib/i18n'

	export let data
	let request: Partial<any> = data.action

	function update() {
		fetch('?/update', {
			method: 'POST',
			body: JSON.stringify(request),
		}).then((res) => {
			// invalidateAll()
			console.log('done')
			// alert.success("page updated!")
		})
	}

	async function openRemoveConfirmModal() {
		const res = await confirmModal.open({ status: 'danger' }, { autoClose: true })
		if (res) {
			fetch('?/removePage', {
				method: 'POST',
				body: JSON.stringify(request),
			}).then((res) => goto('/admin/pages'))
		}
	}
</script>

<Page title="Update Page '{data.action.title}'">
	<ButtonList slot="header-buttons">
		<Button on:click={() => history.back()}>
			<Icon name="chevron-left" />
			Back
		</Button>
	</ButtonList>

	<El row>
		<Tabs>
			<Card>
				<CardHeader>
					<TabList>Tab list</TabList>
				</CardHeader>

				<TabContent>
					<CardBody>Content</CardBody>
					<CardFooter>
						<ButtonList ms="auto">
							<Button on:click={openRemoveConfirmModal} color="danger">
								{t('buttons.remove')}
							</Button>
							<Button href="/admin/pages">{t('buttons.cancel')}</Button>
							<Button on:click={update} color="primary">{t('buttons.save')}</Button>
						</ButtonList>
					</CardFooter>
				</TabContent>
			</Card>
		</Tabs>
	</El>
</Page>
