<script>
	import EditorLayout from '$lib/components/EditorLayout.svelte'

	export let data
</script>

<EditorLayout redirectTo={data.redirect_to} theme={data.theme} dir={data.dir} page_id={data.page_id}>
	<slot/>
</EditorLayout>
