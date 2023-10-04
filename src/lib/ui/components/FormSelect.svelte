<script lang='ts'>
  import FormCheckbox from "$lib/components/core/form/FormCheckbox.svelte";
import { title } from "process";
  import { getContext } from "svelte";
import { Autocomplete, FormInput, FormSelect } from "yesvelte";
  import DynamicList from "./DynamicList.svelte";
let items = getContext('items')
export let props = {}
export let edit = false

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

<FormInput bind:value = {props.itemName} />

<FormCheckbox  bind:value = {props.dynamicList} name = 'Dynamic' />
{#if props.DynamicList}
<Autocomplete title = "Items"  items={Object.keys($items)} bind:value = {props.items} create />
{:else}
<Autocomplete title = "Items"   bind:value = {props.items} create />
{/if}
{:else}
<FormSelect {...props} bind:value = {props.value} name = {props.name} bind:items = { props.items} let:item> 
    {item}
</FormSelect>
{/if}


