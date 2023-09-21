<script lang="ts">
  import { FormInput, ModalBody, TabContent, TabItem, TabList, TabPanel, Tabs } from "yesvelte";

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

<FormInput label="Label" bind:value={props.label} />
<FormInput label="Type" bind:value={props.type} />
<FormInput label="Name" bind:value={props.name} />
 
<FormInput label="Default Value" bind:value={props.defaultValue}/>
{:else}
  <FormInput label={props.label} type={props.type} name={props.name} {...$$restProps} value={props.value ?? props.defaultValue}/>
{/if}
