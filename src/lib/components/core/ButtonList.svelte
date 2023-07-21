<script>
	import { El } from 'yesvelte'
</script>

<El {...$$restProps} d="flex" class="flex-wrap" gap="2">
	<slot />
</El>
