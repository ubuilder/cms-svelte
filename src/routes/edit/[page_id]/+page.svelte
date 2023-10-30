<script>
	import EditorLayout from '$lib/components/EditorLayout.svelte'

import {navigating} from '$app/stores'
	import { Loading } from '@ulibs/yesvelte'

	export let data
</script>

	<EditorLayout {...data}>
		{#if $navigating}
			<Loading show absolute/>
		{:else}
        <slot/>
		{/if}
    </EditorLayout>
