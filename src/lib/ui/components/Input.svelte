<script lang="ts">
  import { FormInput } from "yesvelte";

  export const data = {
    props: [
      {type: 'plain_text', name: 'value'},
    ],
    hasSlot: false
  }

  export let edit = false
  

  export let props: any = {};
</script>
<!-- 
{#if edit}
    Edit INPUT
{:else}
<Input {...$$restProps}/>
{/if}
 -->

{#if edit}
  <FormInput class = 'u-component' label="Value" bind:value={props.value} />
{:else}
  <FormInput {...$$restProps} value={props.value}/>
{/if}
