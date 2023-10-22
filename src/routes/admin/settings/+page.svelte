<script>
	import { invalidateAll } from '$app/navigation'
	import { t } from '$lib/i18n'
	import {
		Button,
		ButtonList,
		Card,
		CardBody,
		CardFooter,
		El,
		FormField,
		FormInput,
		FormRadioGroup,
		FormSelect,
		Icon,
		Page,
	} from '@ulibs/yesvelte'
	// export let data;
	export let data

	function save() {
		fetch('?/save', {
			method: 'POST',
			body: JSON.stringify(data.settings),
		}).then((res) => {
			location.reload()
		})
	}
	let pages = data.pages

	let languages = [
		{ key: 'fa', text: 'فارسی' },
		{ key: 'ps', text: 'پشتو' },
		{ key: 'en', text: 'English' },
	]

	let themes = [
		{ key: 'dark', text: t('settings.dark') },
		{ key: 'light', text: t('settings.light') },
	]
</script>

<Page title={t('settings.title')}>
	<Card>
		<CardBody>
			<FormSelect
				items={languages}
				key="key"
				placeholder={t('settings.choose_language')}
				bind:value={data.settings.lang}
				label={t('settings.language')}
				let:item>
				{item.text}
			</FormSelect>
			<FormRadioGroup
				inline
				items={themes}
				key="key"
				bind:value={data.settings.theme}
				label={t('settings.theme')}
				let:item>
				{item.text}
			</FormRadioGroup>

			<FormSelect
				items={pages}
				key="id"
				placeholder={t('settings.page_home_placeholder')}
				bind:value={data.settings.page_home}
				label={t('settings.page_home')}
				let:item>
				{item.title}
			</FormSelect>

			<FormSelect
				items={pages}
				key="id"
				placeholder={t('settings.page_404_placeholder')}
				bind:value={data.settings.page_404}
				label={t('settings.page_404')}
				let:item>
				{item.title}
			</FormSelect>

			<FormField label="Menus (Sidebar)">
				<El row>
					{#each data.settings.menu ?? [] as menu, index}
						<FormInput bind:value={menu.icon} col="2" label={index == 0 ? 'Icon' : undefined} />
						<FormInput bind:value={menu.title} col="5" label={index == 0 ? 'Name' : undefined} />
						<FormInput bind:value={menu.href} col label={index == 0 ? 'Href' : undefined} />
						<El col="auto" mt={index === 0 ? '4' : undefined}>
							<Button
								on:click={() => (data.settings.menu = data.settings.menu.filter((x) => x !== menu))}
								ghost
								color="danger"><Icon name="trash" /></Button>
						</El>
						<El col="12" />
					{/each}

					<El>
						<Button
							color="primary"
							on:click={() =>
								(data.settings.menu = [
									...(data.settings.menu ?? []),
									{ icon: '', title: '', href: '' },
								])}>
							<Icon name="plus" />
							Add Menu
						</Button>
					</El>
				</El>
			</FormField>
		</CardBody>
		<CardFooter>
			<ButtonList ms="auto">
				<Button href="../">{t('buttons.cancel')}</Button>
				<Button color="primary" on:click={save}>{t('buttons.save')}</Button>
			</ButtonList>
		</CardFooter>
	</Card>
</Page>
