<script lang="ts">
	import {
		Page,
		FilterList,
		TextFilter,
		SelectFilter,
		Button,
		El,
		Icon,
		modal,
		alert,
		PageHeader,
		confirmModal,
	} from '@ulibs/yesvelte'
	import Asset from '$lib/components/Asset.svelte'
	import { invalidateAll } from '$app/navigation'
	import { t } from '$lib/i18n'
	import type { AssetType } from '$lib/types/asset'
	import { createEventDispatcher, onMount } from 'svelte'
	import AssetUpdateModal from '$lib/components/AssetUpdateModal.svelte'
	import { api } from '$lib/helpers/api'

	let assets: AssetType[] = []

	let uploadInput: any

	const dispatch = createEventDispatcher()

	async function onSubmit(event: any) {
		const formData = new FormData()

		formData.append('file', event.target.files[0])

		const res = await api('/assets', {
			formData,
		})

		// console.log('file uploaded: res: ', res)
		// reload()

		alert.success(res.message || 'File uploaded successfully')
		assets = [...assets, res.data]
	}

	async function onPreview({ detail }: CustomEvent) {
		const data = await modal.open(
			AssetUpdateModal,
			{
				asset: detail,
			},
			{ size: 'lg' }
		)

		if (data) {
			await api('/assets', { params: { id: detail.id }, data })

			reload()
		}
	}

	async function onRemove(asset: Asset) {
		const choice = await confirmModal.open()

		if (choice) {
			await api('/assets', { params: { id: asset.id }, method: 'DELETE' })
			reload()
		}
	}

	async function reload() {
		console.log('reload assets')
		assets = await api('/assets').then((res) => res.data)
	}

	onMount(() => {
		reload()
	})

	let filters = {}
</script>

<Page title="">
	<PageHeader slot="header" title="Assets">
		<Button on:click={() => dispatch('close')}>
			{t('buttons.cancel')}
		</Button>

		<Button on:click={() => uploadInput.click()} color="primary">
			<Icon name="upload" />
			{t('assets.upload')}
		</Button>
	</PageHeader>

	<FilterList bind:filters>
		<SelectFilter
			key="type"
			items={[
				{ text: t('assets.filters.image'), key: 'image' },
				{ text: t('assets.filters.audio'), key: 'audio' },
				{ text: t('assets.filters.video'), key: 'video' },
			]}
			text="Type" />
		<TextFilter key="name" text={t('assets.filters.name')} />
	</FilterList>

	<!-- Upload file form -->
	<El d="none">
		<input name="file" type="file" bind:this={uploadInput} on:change={onSubmit} />
	</El>

	<El row>
		{#each assets as asset}
			<Asset on:remove={(event) => onRemove(asset)} on:select={onPreview} {asset} />
		{/each}
	</El>
</Page>
