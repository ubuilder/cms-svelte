<script lang="ts">
  import { Button } from "yesvelte";

  export let text: string;
  export let edit = false;
</script>

<!-- 
  
{#if edit}
  Edit Button
{:else}
  <Button {...$$restProps}>
    <slot />
  </Button>
{/if}

-->

<div class="u-component">
  {#if edit}
    Edit Button
  {:else}
    <Button {...$$restProps}>
      {text}
    </Button>
  {/if}
</div>
