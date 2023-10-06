<script context="module">
  export const hasSlot = true;
</script>

<script lang="ts">
  import { El, FormField, FormInput } from "yesvelte";
  import SlotList from "../SlotList.svelte";
  import DynamicFormField from "$lib/components/data/DynamicFormField.svelte";

  export const data = {
    props: [{ type: "plain_text", name: "size" }],
    hasSlot: true,
  };

  export let items: any = {};
  export let slots: any[] = [];
  export let props: any = {};

  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <DynamicFormField
      {items}
      type="select"
      label="Size"
      options={["sm", "md", "lg", "xl", true]}
      bind:value={props.size}
    />
    <FormField label="Slot">
      <SlotList bind:slots {items} />
    </FormField>
  </El>
{:else}
  <El container={props.size} {...$$restProps}>
    <slot />
  </El>
{/if}
