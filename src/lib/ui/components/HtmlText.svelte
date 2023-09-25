<script lang="ts">
  import { Editor } from "yesvelte";

  export const data = {
    props: [
      {type: 'rich_text', name: 'text'},
    ],
    hasSlot: true
  }

  

  export let props: any = {};

  export let edit = false;

// export let value: string;
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
  <Editor bind:value={props.text}  class = 'u-component'/>
{:else}
  <div {...$$restProps} >
    {@html props.text}
  </div>
{/if}
