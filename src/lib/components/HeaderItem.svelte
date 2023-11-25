<script lang="ts">
	import { Icon } from "yesvelte"

export let icon: string = '';
export let active = false

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div
class:active= {active}
{...$$restProps}
on:click
on:dblclick
	class="font-bold cursor-pointer hover:text-blue-500 rounded {$$restProps.class}"
	style="">
    <slot>
        <Icon name={icon}/>
    </slot>
</div>


<style>
	
	:global([data-bs-theme="dark"]) div {
		color: #a0d0ff;
	}

	div {
		color: #6b768b; line-height: 20px; font-size: 16px;
	}
	.active{
		color: #236ffb;
		background-color: #c5d9ff;
	}

	

</style>