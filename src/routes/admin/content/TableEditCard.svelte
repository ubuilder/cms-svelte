<script lang="ts">
  import FormFields from "$lib/components/content/FormFields.svelte";
  import type { Table } from "$lib/types";
  import {
    Button,
    ButtonList,
    El,
    Card,
    Icon,
    FormInput,
    Popover,
    PopoverBody,
    FormField,
    CardBody,
    CardFooter,
  } from "@ulibs/yesvelte";

  export let table: Partial<Table> = {
    icon: 'database',
    fields: [],
  };
  export let tables: Table[] = [];

  
</script>

<Card mt="3" mb="5">
  <CardBody class="table-edit" row>
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
      <FormFields {tables} bind:fields={table.fields} />
    </El>
  </CardBody>

  <CardFooter>

    <ButtonList ms="auto">
      <slot name="footer">
    </slot>
  </ButtonList>
</CardFooter>

</Card>

<style>
  :global(.table-edit .y-autocomplete-item) {
    padding: 0;
  }
</style>
