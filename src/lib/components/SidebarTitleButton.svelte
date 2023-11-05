<script lang="ts">

	import { El, Icon } from "yesvelte"

    export let icon: string | undefined = undefined;

</script>
<El bgColor="primary" class="ms-auto rounded hover:shadow">
    <Icon class="m-[2px]" name={icon} on:click/>

</El>
