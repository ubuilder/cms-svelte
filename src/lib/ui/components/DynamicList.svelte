<script lang="ts">
  import { page } from "$app/stores";
  import { getContext } from "svelte";
  import {
    Button,
    El,
    FormInput,
    FormSelect,
    ModalBody,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
  } from "yesvelte";
  import SlotList from "../SlotList.svelte";
  import { components } from "$lib/ui";
  import Element from "../Element.svelte";
  const items = getContext("items")

  export let props: any = {};

  function updateStore(data: any) {
    $items[data] = 'test'
  }

  export let edit = false;
</script>

{#if edit}
<El p=3>
<El row>

<FormSelect col="6"
    label="items"
    bind:value={props.itemName}
    items={Object.keys($items)}
    let:item
  >
    {$items[item]}
  </FormSelect>
  <FormInput col="6" label="Name" bind:value={props.name} />
</El>

<SlotList bind:slots={props.slot} />
</El>

  {:else}
  
    {#each props.slot as slot}
      <Element element={{...slot, slot: slot.props.slot}} {components}/>
    {/each}
{/if}
