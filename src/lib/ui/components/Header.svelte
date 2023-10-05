<script lang="ts">
  import FilePicker from "$lib/components/data/FilePicker.svelte";
  import { El, FormField, FormInput, FormSelect } from "yesvelte";
  import SlotList from "../SlotList.svelte";

  export let props: any = {};
  export let items: any = {};
  export let slots: any[] = [];
  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <FormInput label="Title" bind:value={props.title} />
    <FormField label="Logo">
      <FilePicker type="image" bind:value={props.logo} />
    </FormField>
    <FormInput label="Background color" bind:value={props.bgcolor} />
    <SlotList bind:slots {items} />
  </El>
{:else}
  <El
    bgColor={props.bgcolor}
    bgOpacity="50"
    borderBottom
    p="4"
    d="flex"
    alignItems="center"
    justifyContent="between"
  >
    <El d="flex" gap="3" alignItems="center">
      <img src="/files/{props.logo}" alt={props.title} width="50" />
      <h1 style="margin:0">{props.title}</h1>
    </El>
    <slot />
  </El>
{/if}
