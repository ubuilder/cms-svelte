<script lang="ts">
  import FieldInput from "$lib/components/content/FieldInput.svelte";
  import {
    Button,
    El,
    ButtonList,
    modal,
    BaseModal,
    FormEditor,
    FormFileUpload,
    FormInput,
    FormSwitch,
    FormTextarea,
  } from "@ulibs/yesvelte";

  export let data: any = {};

  export let submitText = "Insert";
  export let table: any;

  export let title: string;
</script>

<BaseModal {title}>
  <El row slot="body">
    {#each table.fields as field}
      <FieldInput {field} bind:data />
    {/each}
  </El>
  <ButtonList slot="footer" justifyContent="end">
    <Button on:click={() => $modal.close()}>Cancel</Button>
    <Button color="primary" on:click={() => $modal.resolve(data)}
      >{submitText}</Button
    >
  </ButtonList>
</BaseModal>
