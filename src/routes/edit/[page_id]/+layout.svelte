<script>
	import EditorLayout from '$lib/components/EditorLayout.svelte'


	export let data
</script>

	<EditorLayout {...data}>
        <slot/>
    </EditorLayout>
