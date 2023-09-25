<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
  import Modal from "$lib/components/core/modal/Modal.svelte";
  import FormFields from "$lib/components/data/FormFields.svelte";
  import {
    Button,
    El,
    Icon,
    FormInput,
    Popover,
    PopoverBody,
    FormField,
  } from "yesvelte";

  export let title = "Add Table";

  export let submitText = "Create";

  export let table: any = {};
</script>

<Modal {title}>
  <El class="table-edit" row slot="body">
    <El col="auto">
      <FormField label="Icon">
        <Button outline>
          <Icon name={table.icon} />
        </Button>
      </FormField>

      <Popover trigger="click">
        <PopoverBody>
          <FormInput label="Icon" bind:value={table.icon} />
        </PopoverBody>
      </Popover>
    </El>
    <El col>
      <FormInput required label="Name" bind:value={table.name} />
    </El>
    <El col="12">
      <FormFields bind:fields={table.fields} />
    </El>
  </El>

  <ButtonList justifyContent="end" slot="footer">
    <Button on:click={() => $modal.close()}>Cancel</Button>
    <Button
      disabled={!table.name}
      color="primary"
      on:click={() => $modal.resolve(table)}
    >
      {submitText}
    </Button>
  </ButtonList>
</Modal>

<style>
  :global(.table-edit .y-autocomplete-item) {
    padding: 0;
  }
</style>
