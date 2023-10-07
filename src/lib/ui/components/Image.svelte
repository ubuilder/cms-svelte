<script lang="ts">
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";
  import FilePicker from "$lib/components/content/FilePicker.svelte";
  import { El, FormField, FormInput, FormSelect } from "yesvelte";

  export let props: any = {};
  export let items: any = {};

  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <DynamicFormField {items} type="plain_text" label="alt" bind:value={props.alt} />
    <DynamicFormField {items} type="image" label="Image" bind:value={props.image_id} />
  </El>
{:else}
  <El>
    <img src="/files/{props.image_id}" alt={props.alt} />
   
  </El>
{/if}
