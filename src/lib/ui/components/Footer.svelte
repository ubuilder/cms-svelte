<script lang="ts">
  import DynamicFormField from "$lib/components/data/DynamicFormField.svelte";
import { El  } from "yesvelte";

  export let props: any = {};
  export let items: any = {};

  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <DynamicFormField {items} type="plain_text" label="text" bind:value={props.text} />
    <DynamicFormField type="select"
      {items}
      label="Position"
      options={["start", "center", "end"]}
      bind:value={props.position}
     />
    <DynamicFormField {items} type="select" label="Background color" bind:value={props.bgcolor} />
  </El>
{:else}
  <El
    bgColor={props.bgcolor}
    bgOpacity="50"
    borderTop
    p="4"
    d="flex"
    alignItems="center"
    justifyContent={props.position ?? "center"}
  >
    {props.text}
  </El>
{/if}
