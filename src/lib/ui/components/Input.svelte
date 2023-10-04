<script lang="ts">
  import InsertVariable from "$lib/components/core/InsertVariable.svelte";
  import { FormInput, ModalBody, TabContent, TabItem, TabList, TabPanel, Tabs } from "yesvelte";

  export const data = {
    props: [{ type: "plain_text", name: "value" }],
    hasSlot: false,
  };

  export let edit = false;

  export let props: any = {};
  let valueInput: FormInput;
  export let insertVariable = true;
</script>

<!-- 
{#if edit}
    Edit INPUT
{:else}
<Input {...$$restProps}/>
{/if}
 -->

{#if edit}
  <FormInput
    label="Label"
    bind:value={props.label} />
  <FormInput
    label="Type"
    bind:value={props.type} />
  <FormInput
    label="Name"
    bind:value={props.name} />
  {#if insertVariable}
    <InsertVariable target={valueInput} />
  {/if}
  <FormInput
    bind:this={valueInput}
    label="Default Value"
    bind:value={props.defaultValue} />
{:else}
  <FormInput
    label={props.label}
    type={props.type}
    name={props.name}
    {...$$restProps}
    value={props.value ?? props.defaultValue} />
{/if}
