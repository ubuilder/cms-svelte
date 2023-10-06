<script lang="ts">
  import InsertVariable from "$lib/components/core/InsertVariable.svelte";
  import DynamicFormField from "$lib/components/data/DynamicFormField.svelte";
  import { El, FormInput, ModalBody, TabContent, TabItem, TabList, TabPanel, Tabs } from "yesvelte";

  export const data = {
    props: [{ type: "plain_text", name: "value" }],
    hasSlot: false,
  };

  export let edit = false;

  export let props: any = {};
  export let items: any = {};
</script>

<!-- 
{#if edit}
    Edit INPUT
{:else}
<Input {...$$restProps}/>
{/if}
 -->

{#if edit}
<El p="3">
  <DynamicFormField type="plain_text" {items}
    label="Label"
    bind:value={props.label} />
  <DynamicFormField type="plain_text" {items}
    label="Type"
    bind:value={props.type} />
  <DynamicFormField type="plain_text" {items}
    label="Name"
    bind:value={props.name} />
  <!-- {#if insertVariable}
    <InsertVariable target={valueInput} />
  {/if} -->
  <DynamicFormField type="plain_text" {items}
    label="Default Value"
    bind:value={props.defaultValue} />
  </El>

{:else}
  <FormInput
    label={props.label}
    type={props.type}
    name={props.name}
    {...$$restProps}
    value={props.value ?? props.defaultValue} />
{/if}
