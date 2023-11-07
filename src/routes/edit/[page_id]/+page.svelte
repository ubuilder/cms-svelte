<script>
	import EditorLayout from '$lib/components/EditorLayout.svelte'

	export let data
</script>

<EditorLayout theme={data.theme} dir={data.dir} page_id={data.page_id}>
	<slot/>
</EditorLayout>
