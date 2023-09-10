<script>
  import { Input } from "yesvelte";

  export let edit = false
  
</script>
<!-- 
{#if edit}
    Edit INPUT
{:else}
<Input {...$$restProps}/>
{/if}
 -->

<div class = 'u-component'>
  {#if edit}
      Edit INPUT
  {:else}
  <Input {...$$restProps}/>
  {/if}
</div>