<script context="module">
  export const hasSlot = true;
</script>

<script lang="ts">
  import FieldInput from "$lib/components/data/FieldInput.svelte";
  import FormFields from "$lib/components/data/FormFields.svelte";

  import {
    El,
    FormField,
    FormInput,
    FormSelect,
    ModalBody,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
  } from "yesvelte";
  import Button from "./Button.svelte";
  import ButtonList from "$lib/components/core/ButtonList.svelte";

  export let edit: any;
  export let props: any = {};

  const tables = [
    {
      id: "RqHFCvmv",
      name: "Table Name",
      slug: "name",
      icon: "database",
      fields: [
        {
          name: "First Field",
          type: "number",
          hint: "hint",
          negative: false,
          placeholder: "Enter first field...",
        },
        {
          name: "field2",
          type: "plain_text",
          required: true,
          input_type: "input",
          placeholder: "Enter field2",
        },
        { name: "field3", type: "plain_text" },
        {
          name: "test",
          type: "select",
          hint: "hint of select",
          options: "abc,def,addd",
        },
        { name: "Something", type: "date_time", range: false },
        { name: "abc", type: "number", negative: false },
        { name: "boolean", type: "switch" },
      ],
    },
    {
      id: "pLMiSGkz",
      name: "Name",
      slug: "name",
      icon: "database",
      fields: [
        { name: "123", type: "plain_text" },
        { name: "abc", type: "image", mode: "single" },
      ],
    },
    {
      id: "yAcGxFeT",
      name: "Users",
      slug: "u-users",
      icon: "database",
      fields: [
        {
          name: "name",
          type: "plain_text",
          mode: "single",
          required: true,
        },
        {
          name: "username",
          type: "plain_text",
          mode: "single",
          required: true,
        },
        { name: "profile", type: "image", mode: "single" },
        { name: "enabled", type: "switch", mode: "single" },
        { name: "date", type: "date_time", mode: "single" },
        { name: "age", type: "number", mode: "single", negative: false },
      ],
    },
    {
      id: "WMIyWjsS",
      name: "",
      slug: "",
      icon: "database",
      fields: [
        {
          name: "Plain (textarea)",
          type: "plain_text",
          mode: "single",
          required: true,
          input_type: "textarea",
        },
      ],
    },
    {
      id: "uoJJDUyM",
      name: "abc",
      slug: "abc",
      icon: "database",
      fields: [
        {
          name: "plain (textarea)",
          type: "plain_text",
          mode: "single",
          input_type: "textarea",
          required: true,
        },
        { name: "plain (input)", type: "plain_text", mode: "single" },
        {
          name: "number",
          type: "number",
          mode: "single",
          negative: false,
        },
        { name: "rich text", type: "rich_text", mode: "single" },
        { name: "file", type: "file", mode: "single" },
        { name: "image", type: "image", mode: "single" },
        {
          name: "date (single)",
          type: "date_time",
          mode: "single",
          range: false,
        },
        {
          name: "date (range)",
          type: "date_time",
          mode: "single",
          range: true,
        },
      ],
    },
    {
      id: "rdVJXAix",
      name: "u-users",
      slug: "u_users",
      icon: "database",
      fields: [
        { name: "name", type: "plain_text", mode: "single" },
        { name: "username", type: "plain_text", mode: "single" },
        { name: "profile", type: "image", mode: "single" },
        { name: "email", type: "plain_text", mode: "single" },
        { name: "password", type: "plain_text", mode: "single" },
      ],
    },
    {
      id: "QZwuRLgc",
      name: "Blogs",
      slug: "blogs",
      icon: "database",
      fields: [
        { name: "content", type: "rich_text", mode: "single" },
        { name: "title", type: "plain_text", mode: "single" },
        {
          name: "description",
          type: "plain_text",
          mode: "single",
          input_type: "textarea",
        },
        { name: "slug", type: "plain_text", mode: "single" },
        { name: "author_id", type: "plain_text", mode: "single" },
      ],
    },
  ];

  let table: any;

  async function onSubmit(event) {
    const a = await fetch("/actions/" + props.actionid, {
      method: "POST",
      body: JSON.stringify({ data: props.data, table: props.table }),
    }).then((res) => res.json());
  }

  $: if (props.table) {
    table = tables.find((x) => x.id == props.table);
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

  $: console.log(props)
</script>

{#if edit}
  <Tabs style="overflow-y: auto">
    <TabList>
      <TabItem>General</TabItem>
      <TabItem>Fields</TabItem>
      <TabItem>Buttons</TabItem>
    </TabList>
    <TabContent>
      <TabPanel>
        <ModalBody>
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
            key="id"
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
                tokens={props.fields.map((field) => ({
                  text: field.name,
                  key: field.id,
                }))}
              />
            {/each}
          {/if}
        </ModalBody>
      </TabPanel>
      <TabPanel>
        <ModalBody>
          <FormFields bind:fields={props.fields} />
        </ModalBody>
      </TabPanel>
      <TabPanel>
        <ModalBody>
          <FormField label="First Button">
            <Button edit bind:props={props.buttons[0]} />
          </FormField>
          <FormField label="Second Button">
            <Button edit bind:props={props.buttons[1]} />
          </FormField>
        </ModalBody>
      </TabPanel>
    </TabContent>
  </Tabs>
{:else}
  <form
    action="/actions/{props.actionid}"
    on:submit|preventDefault={onSubmit}
    method="post"
  >
  <El row>
    {#each props.fields as field}
      <FieldInput {field} bind:data={props.data} />
    {/each}
  </El>

  <El d="flex" justifyContent="end" gap="2">
    <ButtonList>
      {#each props.buttons as button}
        <Button props={button} />
      {/each}
  </ButtonList>

  </El>

  </form>
{/if}
