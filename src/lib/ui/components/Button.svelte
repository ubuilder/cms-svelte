<script>
  import { Button } from "yesvelte";

  export let edit = false;
</script>

{#if edit}
  Edit Button
{:else}
  <Button {...$$restProps}>
    <slot />
  </Button>
{/if}
