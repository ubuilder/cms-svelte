<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { api } from '$lib/helpers/api'
	import { t } from '$lib/i18n'
	import {
		Button,
		ButtonList,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		El,
		FormField,
		FormInput,
		FormRadioGroup,
		FormSelect,
		Icon,
		Page,
		PageHeader,
		alert,
	} from '@ulibs/yesvelte'
	import { createEventDispatcher, onMount } from 'svelte'

	let pages: any[] = []

	let languages = [
		{ key: 'fa', text: 'فارسی' },
		{ key: 'ps', text: 'پشتو' },
		{ key: 'en', text: 'English' },
	]

	let themes = [
		{ key: 'dark', text: t('settings.dark') },
		{ key: 'light', text: t('settings.light') },
	]

	const dispatch = createEventDispatcher()

	let settings: any = {}
    
	onMount(async () => {
		pages = await api('/pages').then(res => res.data)
		settings = await api('/settings').then((res) => res.data)
		console.log(settings)
	})

	function close(){
		dispatch('close')
	}

	async function updateSettings() {
		const res = await api('/settings', { data: settings })
		alert.success(res.message)
		dispatch('close')	
		setTimeout(()=> location.reload(), 1000)
	}

</script>

<Page>
	<PageHeader slot="header" px="2" title="Settings">
		<Button on:click={close}>{t('buttons.cancel')}</Button>
		<Button color="primary" bgColor="primary" on:click={updateSettings}>
			{t('buttons.save')}
		</Button>
	</PageHeader>
	<Card>
		<CardBody>
			<FormSelect
				disabled
				class="opacity-50"
				items={languages}
				key="key"
				placeholder={settings.lang}
				bind:value={settings.lang}
				label={t('settings.language')}
				let:item>
				{item.text}
			</FormSelect>

			<FormRadioGroup
				class="pointer-events-none opacity-50"
				inline
				items={themes}
				key="key"
				bind:value={settings.theme}
				label={t('settings.theme')}
				let:item>
				{item.text}
			</FormRadioGroup>

			<FormSelect
				items={pages.filter(x => !x.slug.includes('/{'))}
				key="id"
				placeholder={t('settings.page_home_placeholder')}
				bind:value={settings.page_home}
				label={t('settings.page_home')}
				let:item>
				{item.title} ({item.slug})
			</FormSelect>

			<FormSelect
				items={pages.filter(x => !x.slug.includes('/{'))}
				key="id"
				placeholder={t('settings.page_404_placeholder')}
				bind:value={settings.page_404}
				label={t('settings.page_404')}
				let:item>
				{item.title}
			</FormSelect>

			<!-- <FormField label="Menus (Sidebar)">
				<El row>
					{#each settings.menu ?? [] as menu, index}
						<FormInput bind:value={menu.icon} col="2" label={index == 0 ? 'Icon' : undefined} />
						<FormInput bind:value={menu.title} col="5" label={index == 0 ? 'Name' : undefined} />
						<FormInput bind:value={menu.href} col label={index == 0 ? 'Href' : undefined} />
						<El col="auto" mt={index === 0 ? '4' : undefined}>
							<Button
								on:click={() => (settings.menu = settings.menu.filter((x) => x !== menu))}
								ghost
								color="danger"><Icon name="trash" /></Button>
						</El>
						<El col="12" />
					{/each}

					<El>
						<Button
							color="primary"
							on:click={() =>
								(settings.menu = [
									...(settings.menu ?? []),
									{ icon: '', title: '', href: '' },
								])}>
							<Icon name="plus" />
							Add Menu
						</Button>
					</El>
				</El>
			</FormField> -->
		</CardBody>
	</Card>
</Page>
