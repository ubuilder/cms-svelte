<script lang="ts">
	import { Icon } from "yesvelte"

export let icon: string = '';

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div
	on:click
	class="font-bold me-2"
	style="color: #a0d0ff; line-height: 20px; font-size: 16px;">
    <slot>
        <Icon name={icon}/>
    </slot>
</div>
