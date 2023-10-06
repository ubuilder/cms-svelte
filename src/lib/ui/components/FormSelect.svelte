<script lang="ts">
  import { getContext } from "svelte";
  import {
    Autocomplete,
    FormAutocomplete,
    FormCheckbox,
    FormInput,
    FormSelect,
  } from "yesvelte";

  // let items = getContext("items");
  export let props: any = {};
  export let edit = false;
  export let items: any = {}


  let selectItems: any[] = []
  function onCreated({ detail }: CustomEvent) {
    console.log(detail)
    selectItems = [...selectItems, detail];
    props.items =[...(props.items ?? []), detail]
  }
</script>

{#if edit}
  <!-- <FormSelect col="6"
    label="items"
    bind:value={props.itemName}
    items={Object.keys($items)}
    let:item
  > -->
  <!-- {$items[item]} -->
  <!-- </FormSelect> -->

  <FormInput bind:value={props.itemName} />

  <FormCheckbox bind:checked={props.dynamicList} label="Dynamic" />
  {#if props.dynamicList}
    <FormAutocomplete
      title="Items"
      items={Object.keys($items)}
      bind:value={props.items}
    />
  {:else}
    <FormAutocomplete
      on:created={onCreated}
      label="Items"
      multiple
      bind:items={selectItems}
      bind:value={props.items}
      create
    />
  {/if}
{:else}
  <FormSelect
    {...props}
    bind:value={props.value}
    name={props.name}
    bind:items={$items[props.items]}
    let:item
  >
    {item}
  </FormSelect>
{/if}
