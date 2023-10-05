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

  export let load: any;
  export let tables: any;

  let new_load_name: any = "";
  function onRemoveLoad(item: any) {
    load = load.filter((x) => x !== item);
  }


</script>

<FormField label="Load">
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
                on:click={() => (loadItem.filters = [...loadItem.filters, {}])}
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

  <FormInput bind:value={new_load_name} label="New Load Name" />

  <Button
    on:click={() =>
      (load = [...load, { table: undefined, name: new_load_name, filters: [] }])}
  >
    <Icon name="plus" />
    Load Table
  </Button>
</FormField>
