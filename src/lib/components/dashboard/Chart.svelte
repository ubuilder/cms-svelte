<script lang="ts">
	import { Loading } from '@ulibs/yesvelte'
import { onMount } from 'svelte'
	import { Card } from 'yesvelte'

	let element: HTMLDivElement
	let instance

    let loading = true

	export let title = 'XYZ - Stock Analysis (2009 - 2016)'
    export let type = 'line'


    export let data;
    export let yfield;
    export let xfield;


        
    
    console.log(data.map(x => x[yfield]))
	onMount(async () => {
		const apexCharts = await import('apexcharts')

		instance = new apexCharts.default(element, {
			series: [{
                name: yfield,
                data: data.map(x => x[yfield])
            }],

			chart: {
				height: 350,
				type: type,
				zoom: {
					enabled: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'straight',
			},
			title: {
				text: title,
				align: 'left',
			},
			grid: {
				row: {
					colors: ['#3f3f3f', '#404040'], // takes an array which will be repeated on columns
					opacity: 0.5,
				},
			},
			xaxis: {
				categories: data.map(x => {
                    const date = new Date(x.created_at);
                    const y = date.getFullYear();
                    const m = date.getMonth();
                    const d = date.getDate();

                    
                    return `${y}-${m}-${d}`
                }),
			},
            legend: {
                show: true
            }
		})

		await instance.render()
        loading = false
		console.log(instance)
	})
</script>

<Card class="y-chart" {title}>
    {#if loading}
        <Loading show absolute/>
    {/if}
	<div bind:this={element}></div>
</Card>

<style>
	:global(.y-chart) {
        position: relative;
		min-height: 360px;
	}
</style>
