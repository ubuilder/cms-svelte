<script>
	import EditorLayout from '$lib/components/EditorLayout.svelte'

	export let data
</script>

<EditorLayout page_id={data.page_id}>
	<slot/>
</EditorLayout>
