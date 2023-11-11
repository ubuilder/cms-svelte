<script lang="ts">

	import { El, Icon } from "yesvelte"

    export let icon: string | undefined = undefined;
    export let color: string | undefined = undefined;

</script>
<div class="sidebar-title-button" class:sidebar-title-button-secondary={color === 'secondary'}>
    <Icon class="m-[2px]" name={icon} on:click/>

</div>
