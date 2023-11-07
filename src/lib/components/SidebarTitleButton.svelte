<script lang="ts">

	import { El, Icon } from "yesvelte"

    export let icon: string | undefined = undefined;

</script>
<div class="sidebar-title-button">
    <Icon class="m-[2px]" name={icon} on:click/>

</div>
