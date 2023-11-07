<script lang="ts">
	import { Icon } from "yesvelte"

export let icon: string = '';

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div
	on:click
	class="font-bold"
	style="">
    <slot>
        <Icon name={icon}/>
    </slot>
</div>


<style>
	div {
		color: #6b768b; line-height: 20px; font-size: 16px;
	}
	:global([data-bs-theme="dark"]) div {
		color: #a0d0ff;
	}
</style>