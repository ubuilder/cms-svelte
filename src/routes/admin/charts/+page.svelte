<script>
	import {
		Button,
		ButtonList,
		Page,
		FilterList,
		TextFilter,
		El,
		Card,
		Icon,
		modal,
	} from '@ulibs/yesvelte'
	import AddChartModal from './AddChartModal.svelte'
	import { invalidateAll } from '$app/navigation'
	import { t } from '$lib/i18n'
	import Chart from '$lib/components/dashboard/Chart.svelte'
	export let data

	async function addChart() {
		const chart = await modal.open(AddChartModal, {
			data: {},
		})

		if (chart) {
			console.log('should add chart')

			fetch('?/createComponent', {
				method: 'POST',
				body: JSON.stringify(chart),
			})
				.then((res) => res.json())
				.then((res) => {
					// console.log({res})
					invalidateAll()
				})
		}
	}
</script>

<Page title={t('charts.title')}>
	<ButtonList slot="header-buttons">
		<Button color="primary" on:click={addChart}>
			<Icon name="plus" />
			{t('charts.add_chart')}
		</Button>
	</ButtonList>

	<FilterList>
		<TextFilter key="name" text={t('charts.filters.name')} />
	</FilterList>

	<El row>
		{#each data.charts as chart}
			<El mb="2" col colMd="4" colLg="3">
				<Card tag="a" href="./{chart.id}" p="3">
					{chart.name}
				</Card>
			</El>
		{/each}
	</El>

    <Chart yfield="name" data={data.components.data}/>
</Page>
