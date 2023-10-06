<script lang="ts">
  import FilePicker from "$lib/components/data/FilePicker.svelte";
  import { El, FormField, FormInput, FormSelect } from "yesvelte";
  import SlotList from "../SlotList.svelte";
  import DynamicFormField from "$lib/components/data/DynamicFormField.svelte";

  export let props: any = {};
  export let items: any = {}; // [{ text: "Page slot", key: "page.slot" }];
  export let slots: any[] = [];
  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <DynamicFormField
      label="Title"
      type="plain_text"
      {items}
      bind:value={props.title}
    />

    <DynamicFormField
      type="image"
      bind:value={props.logo}
      {items}
      label="Logo"
    />
    <DynamicFormField
      type="plain_text"
      accept={["select"]}
      bind:value={props.bgcolor}
      {items}
      label="Background Color"
    />    
    
    <DynamicFormField
    type="select"
    bind:value={props.container_size}
    {items}
    options={['sm', 'md', 'lg', 'xl']}
    label="Container Size"
  />

    <SlotList bind:slots {items} />
  </El>
{:else}
  <El bgColor={props.bgcolor} bgOpacity="50" borderBottom p="4">
    <El
      container={props.container_size}
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
  </El>
{/if}
