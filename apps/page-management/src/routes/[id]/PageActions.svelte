<script lang="ts">
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";
  import type { Page, PageAction, PageSlot } from "$lib/types";
  import { onMount } from "svelte";
  import { Button, El, FormSelect, Icon } from "yesvelte";
  export let page: Partial<Page> = {};
  export let items: any = {};

  let actions: any[] = [];

  function getForms(items?: PageSlot[]) {
    if (!items) return [];
    let forms = [];
    for (let item of items) {
      console.log(item);
      if (item.type === "Form") {
        forms.push(item);
      }
      //   TODO add loop after adding slot type for components.
      // for(let prop of item.props) {
      //   if(prop.type === )

      // }
    }
    return forms;
  }

  function loadActions() {
    fetch("/api/actions")
      .then((res) => res.json())
      .then((x) => (actions = x));
  }

  onMount(() => {
    loadActions();
  });

  function onAddAction() {
    page.actions = [
      ...(page.actions ?? []),
      {
        props: {},
      },
    ];
  }

  function onRemoveAction(pageAction?: any) {
    page.actions = page.actions?.filter(x => x !== pageAction)

  }

  function getItemsWithFields() {
    // return {...items, fields: }
    console.log(items)
    items['fields'] = {
        text: 'Fields',
        type: 'object',
        content: {}
    }
    return items 
  }
  $: pageForms = getForms(page.slot);
</script>

<El row>
{#each page.actions ?? [] as pageAction}
  {@const action = actions.find((x) => x.key === pageAction.action)}

  <FormSelect
    col
    items={pageForms}
    key={(form) => form.props.name}
    label="Form"
    bind:value={pageAction.form}
    let:item
  >
    {item.props.name}
  </FormSelect>
  <El col="auto" d="flex" mb="3" alignItems="end">
    <Button on:click={() => onRemoveAction(pageAction)} color="danger" ghost>
      <Icon name="trash" />
    </Button>
  </El>
  <FormSelect items={actions} label="Action" key="key" bind:value={pageAction.action} let:item>
    {item.name}
  </FormSelect>
  {#if action}
    {@const table = action.fields.find((x) => x.key === pageAction.props.table)}

    <pre>{JSON.stringify(action, null, 2)}</pre>
    <FormSelect
      items={action.fields}
      key="key"
      label={action.label}
      bind:value={pageAction.props.table}
      let:item
    >
      {item.text}
    </FormSelect>

    {#if table}
      {#each table.fields as field}
        <DynamicFormField
          items={getItemsWithFields()}
          type={field.type ?? "plain_text"}
          label={field.name}
          bind:value={pageAction.props[field.name]}
        />
      {/each}
    {/if}
  {/if}
{/each}
<Button on:click={onAddAction}>Add Action</Button>
</El>
