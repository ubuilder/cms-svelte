<script context="module">
  export const hasSlot = true;
</script>

<script lang="ts">
  import FieldInput from "$lib/components/content/FieldInput.svelte";
  import FormFields from "$lib/components/content/FormFields.svelte";

  import {
    El,
    FormField,
    FormInput,
    FormSelect,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
  } from "yesvelte";
  import Button from "../Button/ViewButton.svelte";
  import { page } from "$app/stores";
  import type { Table } from "$lib/types";
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";
  import SlotList from "$lib/ui/SlotList.svelte";

  export let edit: any;
  export let props: any = {};
  export let items: any = {};

  const tables: Table[] = $page.data.tables;

  let table: any;

  const actions = [
    {
      name: "Create",
      key: "create",
      fields: [
        {
          name: 'Table',
          key: 'table',
          options: tables.map(x => ({key: x.slug, text: x.name, fields: x.fields}))
        }
      ],
    },
    {
      name: "Remove",
      key: "remove",
      fields: [
        {
          name: 'Table',
          key: 'table',
          options: tables.map(x => ({key: x.slug, text: x.name, fields: [{name: 'id', type: 'plain_text'}]}))
        }
      ],
    },
  ];

  $: if (props.table && edit) {
    table = tables.find((x) => x.slug == props.table);
  }

  $: if (!props.data) {
    props.data = {};
  }
  $: if (!props.buttons) {
    props.buttons = [];
  }
  $: if (!props.fields) {
    props.fields = [];
  }

  $: action = actions.find((x) => x.key === props.action);
  $: field = action?.fields.find(x => x.key === props.field)
</script>

<FormInput bind:value={props.name} label="Name"/>

<FormField label="Content">
  <SlotList bind:slots={props.slot}/>
</FormField>
<!-- 
<FormSelect items={actions} key="key" let:item>
  {item.name}
</FormSelect> -->

<!-- {#if action}
  {#each action.fields as field}
    <DynamicFormField type="select" {items} label={field.name} bind:value={props[field.name]}/>
  {/each}

{/if} -->
<!-- TODO: Clean this component and use DynamicFormField
    <Tabs style="overflow-y: auto">
      <TabList>
        <TabItem>General</TabItem>
        <TabItem>Fields</TabItem>
        <TabItem>Buttons</TabItem>
      </TabList>
      <TabContent>
        <TabPanel p=3>
  
            <FormField mb="3" label="Choose action">
              <El row g="2">
                {#each ["create", "remove", "update"] as item}
                  <El col="3">
                    <El
                      style="cursor: pointer"
                      border
                      borderColor={props.actionid === item
                        ? "primary"
                        : undefined}
                      py="3"
                      textAlign="center"
                      shadow="sm"
                      borderRoundSize="2"
                      on:click={() => (props.actionid = item)}
                    >
                      {item}
                    </El>
                  </El>
                {/each}
              </El>
            </FormField>
  
            <FormSelect
              label="Table"
              key="slug"
              bind:value={props.table}
              items={tables}
              let:item
            >
              {item.name}
            </FormSelect>
  
            {#if props.actionid === "remove"}
              <FormInput label="Item id" bind:value={props.data.id} />
            {:else if props.actionid === "create"}
              {#each table?.fields ?? [] as field}
                <FieldInput
                  {field}
                  bind:data={props.data}
                  items={props.fields.map((field) => ({
                    text: field.name,
                    key: field.id,
                  }))}
                />
              {/each}
            {/if}
        </TabPanel>
        <TabPanel p="3">
            <FormFields {tables} bind:fields={props.fields} />
        </TabPanel>
        <TabPanel p="3">
            <FormField label="First Button">
              <Button edit bind:props={props.buttons[0]} />
            </FormField>
            <FormField label="Second Button">
              <Button edit bind:props={props.buttons[1]} />
            </FormField>
        </TabPanel>
      </TabContent>
    </Tabs>
   -->
