<script lang="ts">
  import DynamicFormField from '$lib/components/content/DynamicFormField.svelte'
  import type { ComponentField } from '$lib/types'
  import {
    Card,
    CardBody,
    El,
    FormField,
    FormInput,
    FormSelect,
    FormSwitch,
    Label,
    Switch,
  } from 'yesvelte'
  import SlotList from './SlotList.svelte'
  import { createEventDispatcher } from 'svelte'

  const icons: any = {
    plain_text: 'abc',
    rich_text: 'float-left',
    // date_time: "calendar",
    switch: 'toggle-right',
    number: '123',
    file: 'file-text',
    image: 'photo',
    slot: 'box',
    // relation: "database-share",
    select: 'list',
  }

  export let field: ComponentField
  export let items: any = {}
  export let components: any[] = []

  export let value: any

  let dynamic = false

  let accept: any[] = []

  if (field.type === 'slot') {
    if (value?.type === '__list__') {
      dynamic = true
    }

    if (dynamic) {
      if (!value) {
        value = {
          props: {},
        }
      }

      if (!value.props.slot) {
        value.props.slot = []
      }
    } else {
      if (!value) {
        value = []
      }
    }
  }

  if (field.type === 'plain_text') {
    accept = ['number', 'select', 'date_time', 'plain_text']
  }
  if (field.type === 'rich_text') {
    accept = ['number', 'select', 'plain_text', 'date_time']
  }
  if (field.type === 'slot') {
    accept = ['slot']
  }

  function getItemsArray(items: any, array: any[] = [], key = '') {
    let list: any[] = []

    Object.keys(items).map((item) => {
      list.push({
        text: items[item].text,
        key: key ? key + '.' + item : item,
        type: items[item].type,
      })
      if (items[item].type === 'object' && items[item].content) {
        list = getItemsArray(items[item].content, list, (key ? key + '.' : '') + item)
        console.log(list)
      }
    })

    return [...array, ...list]
  }

  function onChangeDynamic(e) {
    dynamic = !dynamic

    if (dynamic) {
      value = {
        type: '__list__',
        props: {
          slot: value,
        },
      }
    } else {
      value = value.props.slot
    }
  }

  function getItems(items: any, key: string, name: string) {
    // const array = items[]
    if (!key || !name) return items

    const array = key.split('.').reduce((prev, curr) => {
      if (!prev) return

      if (prev['content']) {
        return prev['content'][curr]
      } else {
        return prev[curr]
      }
    }, items)

    if (array) {
      const content: any = {}

      Object.keys(array.content).map((key) => {
        content[key] = {
          type: array.content[key].type,
          text: name + "'s " + key, //
        }
      })

      const result = {
        ...items,
        [name]: {
          type: 'object',
          text: name,
          content,
        },
      }
      console.log({ result })
      return result
    }
    return items
  }

  // $: if(field.type == 'slot') {

  //   value = {
  //     props: {}
  //   }
  // }

  // $: if (dynamic) {
  // 	value = {
  // 		type: 'List',
  // 		props: {
  // 			slot: [],
  // 		},
  // 	}
  // }
  const dispatch = createEventDispatcher()
  let key = 1
  function reload() {
	dispatch('reload')
	dispatch('update')
    key = key + 1
  }
</script>

{#if field.type === 'slot'}
  {@const itemsArray = getItemsArray(items).filter((x) => x.type === 'array' || x.type === 'slot')}
  {@const isSlot = itemsArray.find((x) => x.key === value?.props?.load)?.type === 'slot'}
  <FormField colMd={field.col}>
    <El d="flex" justifyContent="between" slot="label">
      <Label>{field.name}</Label>

      <Switch checked={dynamic} mb="0" on:change={onChangeDynamic}>Dynamic</Switch>
    </El>

    {#if dynamic}
      <El row>
        {#if value.props}
          <FormSelect
            col={isSlot ? '12' : '6'}
            key="key"
            label="List"
            items={itemsArray}
            bind:value={value.props.load}
            let:item>{item.text}</FormSelect>
          {#if !isSlot}
            <FormInput
              col="6"
              bind:value={value.props.item}
              label="Name"
              placeholder="Name of iterator variable" />
          {/if}
        {/if}
      </El>
    {/if}

    {#if dynamic && !isSlot}
      <SlotList
        buttonText={field.buttonText}
        componentId={field.componentId}
        allowedComponents={field.allowedComponents}
        disabledComponents={field.disabledComponents}
        {components}
        items={getItems(items, value.props.load, value.props.item)}
        bind:slotList={value.props.slot} />
    {:else if !isSlot}
      <SlotList
        buttonText={field.buttonText}
        componentId={field.componentId}
        allowedComponents={field.allowedComponents}
        disabledComponents={field.disabledComponents}
        {components}
        {items}
        bind:slotList={value} />
    {/if}
  </FormField>
{:else}
  {#key key}
    <DynamicFormField
      on:change={reload}
      {accept}
      col={field.col}
      icon={icons[field.type]}
      label={field.name}
      {items}
      {...field}
      bind:value />
  {/key}
{/if}
