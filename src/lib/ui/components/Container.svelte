<script context="module">
  export const hasSlot = true
</script>

<script lang="ts">
  import { El, FormField, FormInput } from "yesvelte";
  import SlotList from "../SlotList.svelte";

  export const data = {
    props: [{ type: "plain_text", name: "size" }],
    hasSlot: true,
  };

  export let slots: any[] = []
  export let props: any = {};

export let edit = false;
</script>

{#if edit}
<El p="3">
  <FormInput label="Size" bind:value={props.size} />
  <FormField label="Slot">
    <SlotList bind:slots />
  </FormField>
</El>

{:else}
  <El container={props.size} {...$$restProps}>
    <slot />
  </El>
{/if}
