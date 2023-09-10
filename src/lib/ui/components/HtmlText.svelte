<script lang="ts">
  import { Editor } from "yesvelte";

  export let text: string;
  export let edit = false;
  export let value: string;
</script>
<!-- 
{#if edit}
  <Editor bind:value />
{:else}
  <div {...$$restProps} >
    {@html text}
  </div>
{/if}
 -->

{#if edit}
  <Editor bind:value  class = 'u-component'/>
{:else}
  <div {...$$restProps} class = 'u-component'>
    {@html text}
  </div>
{/if}
