<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
  import Modal from "$lib/components/core/modal/Modal.svelte";
  import {
    Button,
    El,
    Icon,
    FormInput,
    Input,
    Popover,
    PopoverBody,
    FormField,
    Accordions,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Badge,
    FormSelect,
  } from "yesvelte";

  let new_name = "";

  const selectItems = [
    { key: "plain_text", text: "Plain Text" },
    { key: "rich_text", text: "Rich Text" },
    { key: "number", text: "Number" },
    { key: "file", text: "File" },
    { key: "date_time", text: "Date & Time" },
    { key: "relation", text: "Relation" },
    { key: "switch", text: "Switch" },
    { key: "select", text: "Select" },
  ];

  export let title = "Add Table";

  export let table: any = {};
</script>

<Modal {title}>
  <El row slot="body">
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
      <FormInput label="Name" bind:value={table.name} />
    </El>
    <El col="12">
      <FormField label="Fields">
        <Accordions>
          {#each table.fields as field}
            <Accordion mb="2">
              <AccordionHeader border>
                <El d="flex" alignItems="center" gap="2">
                  {field.name}
                  {#if field.required}
                    <Badge
                      on:click!stopPropagation={() =>
                        (field.required = !field.required)}
                      color="danger">Required</Badge
                    >
                  {:else}
                    <Badge
                      on:click!stopPropagation={() =>
                        (field.required = !field.required)}
                      color="info">Optional</Badge
                    >
                  {/if}
                </El>
              </AccordionHeader>
              <AccordionBody>
                <El row>
                  <FormInput
                    col="12"
                    colSm="6"
                    label="Name"
                    bind:value={field.name}
                  />
                  <FormSelect
                    col="12"
                    colSm="6"
                    label="type"
                    key="key"
                    items={selectItems}
                    bind:value={field.type}
                    let:item
                  >
                    {item.text}
                  </FormSelect>
                  <FormInput col="12" label="Hint" bind:value={field.hint} />
                </El>
              </AccordionBody>
            </Accordion>
          {/each}
        </Accordions>

        <El
          tag="form"
          on:submit!preventDefault={() => {
            table.fields = [
              ...table.fields,
              { name: new_name, type: "plain_text" },
            ];
            new_name = "";
          }}
          row
        >
          <El col>
            <Input bind:value={new_name} placeholder="Name of new field..." />
          </El>
          <El col="auto">
            <Button type="submit">Add Field</Button>
          </El>
        </El>
      </FormField>
    </El>
  </El>

  <ButtonList justifyContent="end" slot="footer">
    <Button on:click={() => $modal.close()}>Cancel</Button>
    <Button color="primary" on:click={() => $modal.resolve(table)}
      >Create</Button
    >
  </ButtonList>
</Modal>
