<script lang="ts">
  import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionTitle,
    Accordions,
    Button,
    Card,
    El,
    FormCheckbox,
    FormField,
    FormInput,
    FormSelect,
    Icon,
  } from "yesvelte";
  import ButtonList from "../ButtonList.svelte";
  import type { PageLoad, Table } from "$lib/types";

  export let load: PageLoad[];
  export let tables: Table[];

  let new_load_name: any = "";
  let new_load_table: any = undefined;

  function onAddLoad() {
    load = [
      ...load,
      {
        table: new_load_table,
        name: new_load_name,
        filters: [],
        multiple: true,
      },
    ];
    new_load_name = "";
    new_load_table = undefined;
  }

  function onRemoveLoad(item: any) {
    load = load.filter((x: any) => x !== item);
  }
</script>

<Accordions>
  {#each load as loadItem}
    <Card my="2">
      <Accordion style="border: none">
        <AccordionHeader p="0">
          <El w="100" d="flex" alignItems="center" justifyContent="between">
            <AccordionTitle px="3" style="flex: 1">
              {loadItem.name}
            </AccordionTitle>
            <ButtonList on:click>
              <Button
                border="0"
                on:click!stopPropagation={() => onRemoveLoad(loadItem)}
              >
                <Icon name="trash" />
              </Button>
            </ButtonList>
          </El>
        </AccordionHeader>

        <AccordionBody>
          <FormInput label="Name" bind:value={loadItem.name} />
          <FormSelect
            placeholder="Choose a table...."
            label="Table Name"
            items={tables}
            key="slug"
            bind:value={loadItem.table}
            let:item
          >
            {item.name}
          </FormSelect>
          <FormCheckbox label="Multiple" bind:checked={loadItem.multiple} />
          <FormField label="Filters">
            {#each loadItem.filters as filter}
              {@const table = tables.find((x) => x.slug === loadItem.table)}

              {#if table}
                <El row>
                  <FormSelect
                    col="3"
                    label="Field"
                    items={table.fields}
                    key="name"
                    bind:value={filter.field}
                    let:item
                  >
                    <Icon name="user" />

                    {item.name}
                  </FormSelect>
                  <FormSelect
                    col="2"
                    label="Operator"
                    items={["=", "!=", "like"]}
                    bind:value={filter.operator}
                    let:item
                  >
                    {item}
                  </FormSelect>
                  <FormInput col label="Value" bind:value={filter.value} />
                  <Button
                    color="danger"
                    ghost
                    px="2"
                    mb="3"
                    mt="4"
                    col="auto"
                    on:click={() =>
                      (loadItem.filters = loadItem.filters.filter(
                        (x) => x !== filter
                      ))}><Icon name="trash" /></Button
                  >
                </El>
              {/if}
            {/each}

            <Button
              color="primary"
              on:click={() => (loadItem.filters = [...loadItem.filters, {field: '', operator: '=', value: ''}])}
            >
              <Icon name="plus" />
              Add New Filter
            </Button>
          </FormField>
        </AccordionBody>
      </Accordion>
    </Card>
  {/each}
</Accordions>

<El row>
  <FormInput colLg="5" bind:value={new_load_name} label="New Load Name" />
  <FormSelect
    colLg="5"
    placeholder="Choose a table...."
    label="Table Name"
    items={tables}
    key="slug"
    bind:value={new_load_table}
    let:item
  >
    {item.name}
  </FormSelect>
  <El col mt="1">
    <Button w="100" mt="4" color="primary" on:click={onAddLoad}>
      <Icon name="plus" />
      Load Table
    </Button>
  </El>
</El>
