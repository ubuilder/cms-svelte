<script>
	import { setLang, t } from '$lib/i18n'
	import '@ulibs/yesvelte/styles.css'
	import '../../app.css'

	export let data

	setLang(data.lang)

</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap"
		rel="stylesheet" />
	<link
		href="https://fonts.googleapis.com/css2?family=family=Vazirmatn:wght@400;700&display=swap"
		rel="stylesheet" />
</svelte:head>

{#if data.user}
    <slot/>
{/if}

<style>
	:global(.y-form-input .y-label) {
		padding: 0;
	}
</style>
