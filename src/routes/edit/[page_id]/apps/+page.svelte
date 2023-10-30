<script>
	import { t } from '$lib/i18n'
	import {
		FilterList,
		El,
		Card,
		CardBody,
		Button,
		Page,
		TextFilter,
		CardTitle,
		Icon,
	} from '@ulibs/yesvelte'

	export let data
</script>

<Page title={t('apps.title')}>
	<FilterList>
		<TextFilter key="name" text={t('apps.filters.name')} />
	</FilterList>

	<El row>
		{#each data.apps as app}
			<El colMd="4">
				<Card mb="3" tag="a" href="./{app.slug}">
					<CardBody>
						<El textAlign="center">
							<Icon color="secondary" mx="auto" mt="3" mb="4" size="5x" name={app.icon} />
						</El>
						<CardTitle textAlign="center">{app.name}</CardTitle>
					</CardBody>
				</Card>
			</El>
		{/each}
	</El>
</Page>
