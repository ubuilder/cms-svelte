<script lang="ts">
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";
  import type { ComponentField } from "$lib/types";
  import { FormField } from "yesvelte";
  import SlotList from "./SlotList.svelte";

  export let field: ComponentField;
  export let items: any = {};
  export let components: any[] = [];


  export let value: any;
</script>

{#if field.type === "slot"}
  <FormField colMd={field.col} label={field.name}>
    <SlotList {components} {items} bind:slotList={value} />
  </FormField>
{:else}
  <DynamicFormField
    col={field.col}
    label={field.name}
    {items}
    {...field}
    bind:value
  />
{/if}
