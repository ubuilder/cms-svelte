<script lang="ts">
  import FilePicker from "$lib/components/data/FilePicker.svelte";
    import { El, FormField, FormInput, FormSelect } from "yesvelte";
  
    export let props: any = {};
  
    export let edit = false;
  </script>
  
  {#if edit}
    <El p="3">
      <FormInput label="alt" bind:value={props.alt} />  
      <FormField label="Image">
        <FilePicker bind:value={props.file_id} />
      </FormField>
      <FormInput label="image_url" bind:value={props.image_url} />
    </El>
  {:else}
    <El p="2">
        {#if props.file_id}
        <img src="/files/{props.file_id}" alt={props.alt} />
        {:else}
        <img src={props.image_url} alt={props.alt} />
        {/if}
    </El>
  {/if}
  