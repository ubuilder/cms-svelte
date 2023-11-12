<script lang="ts">
  import FormFields from "$lib/components/content/FormFields.svelte";
  import { t } from "$lib/i18n";
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
  $:console.log('table: ', table)
  export let tables: Table[] = [];

  
</script>

<Card mt="3" mb="5">
  <CardBody class="table-edit" row>
    <El col="auto">
      <FormField label={t('content.forms.icon')}>
        <Button style="background-color: var(--y-bg-forms) !important;" outline>
          <Icon name={table.icon} />
        </Button>
      </FormField>

      <Popover trigger="click">
        <PopoverBody>
          <FormInput label={t('content.forms.icon')} bind:value={table.icon} />
        </PopoverBody>
      </Popover>
    </El>
    <El col>
      <FormInput required label={t('content.forms.name')} bind:value={table.name} />
    </El>
    <El col="12">
      <FormFields {tables} bind:fields={table.fields} />
    </El>
  </CardBody>
</Card>

<style>
  :global(.table-edit .y-autocomplete-item) {
    padding: 0;
  }
</style>
