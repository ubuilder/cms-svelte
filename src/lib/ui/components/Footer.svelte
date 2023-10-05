<script lang="ts">
  import { El, FormInput, FormSelect } from "yesvelte";

  export let props: any = {};

  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <FormInput label="text" bind:value={props.text} />
    <FormSelect
      label="position"
      items={["start", "center", "end"]}
      bind:value={props.position}
      let:item
    >
      {item}
    </FormSelect>
    <FormInput label="Background color" bind:value={props.bgcolor} />
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
