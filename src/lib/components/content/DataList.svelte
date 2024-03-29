<script lang="ts">
  import {
    ButtonList,
    Page,
    ListBox,
    FilterList,
    SelectFilter,
    TextFilter,
    DateFilter,
    NumberFilter,
    ListItem,
    confirmModal,
    modal,
    Button,
    El,
    Icon,
    Status,
    Switch,
    Avatar,
    alert,
  } from '@ulibs/yesvelte'
  import { invalidateAll } from '$app/navigation'

  import { t } from '$lib/i18n'
  import RelationItem from './RelationItem.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import { api } from '$lib/helpers/api'

  export let table
  let rows = []

  $: console.log('table: ', table)
  $: console.log('rows: ', rows)

  async function removeItem(item: any) {
    const choice = await confirmModal.open({
      status: 'danger',
      title: t('content.messages.remove_row'),
    })

    if (choice) {
      const res = await api(`/content/${table.id}`, {
        params: { id: item.id },
        method: 'DELETE',
      }).then((res) => res)
      alert.success(res.message)
      await invalidateAll()
    }
  }
  function insert() {
    dispatch('dataInsert')
  }
  const dispatch = createEventDispatcher()
  function close() {
    dispatch('close')
  }
  function onEdit(data) {
    table.selectedItem = data
    dispatch('data-edit', data)
  }
  function onView(data) {
    table.selectedItem = data
    dispatch('data-view', data)
  }

  let filters : any = {}

  function onTableEdit(){
    delete table.selectedItem
    dispatch("table-settings")
  }

    async function load(filters) {
        const res = await api(`/content/${table.id}`, {filters}).then((res) => res)
        rows = res.data?.data
    }

$: load(filters)
</script>

<Page title={table.name}>
  <svelte:fragment slot="title">
    <Icon mb="2" size="xl" name={table.icon} me="1" />
    {table.name}
    <Button ghost on:click = {onTableEdit}>
      <Icon name="settings" />
    </Button>
  </svelte:fragment>
  <ButtonList slot="header-buttons">
    <Button on:click={close}>
      <Icon name="chevron-left" />
      {t('buttons.back')}
    </Button>

    <Button on:click={insert} color="primary">
      <Icon name="plus" />
      {t('buttons.insert')}
    </Button>
  </ButtonList>

  <FilterList bind:filters>
    {#each table.fields.filter((x) => x.show_in_list !== false) as field}
      {#if field.type === 'select'}
        <SelectFilter
          items={(field.options ?? '').split(',').map((x) => x.trim()) ?? []}
          text={field.name}
          key={field.name} />
      {:else if field.type === 'switch'}
        <SelectFilter
          items={[
            { key: true, text: t('content.filters.true') },
            { key: false, text: t('content.filters.false') },
          ]}
          text={field.name}
          key={field.name} />
      {:else if field.type === 'date_time'}
        <DateFilter key={field.name} text={field.name} />
      {:else if field.type === 'number'}
        <NumberFilter key={field.name} text={field.name} />
      {:else if field.type === 'plain_text' || field.type === 'rich_text'}
        <TextFilter text={field.name} key={field.name} />
      {/if}
    {/each}
  </FilterList>
  <ListBox title="" items={rows} let:item>
    {#each table.fields.filter((x) => x.show_in_list !== false) as field}
        <ListItem name={field.name} footer={field.type === 'number' ? rows.reduce((prev, curr) => prev + curr[field.name], 0) : ''}>
        {#if field.type === 'switch'}
          <Switch disabled checked={item[field.name]} />
        {:else if field.type === 'select'}
          {#if item[field.name]}
            <Status color="light">{item[field.name]}</Status>
          {/if}
        {:else if field.type === 'image'}
          <El tag="img" width="64px" src="/files/{item[field.name]}" />
        {:else if field.type === 'relation'}
          {#if field.multiple}
            {#each item[field.name] as x}
              <RelationItem value={x} table={field.table} title={field.title} />
            {/each}
          {:else}
            <RelationItem value={item[field.name]} table={field.table} title={field.title} />
          {/if}
        {:else}
          {item[field.name]?.toString().substring(0, 100) + (item[field.name]?.length > 100 ? '...' : '')}
        {/if}
      </ListItem>
    {/each}
    <ListItem name={t('content.created_at')} style="white-space: nowrap;">
      {new Date(item.created_at).toDateString()}
    </ListItem>

    <ListItem name={t('content.created_by')}>
      {#if item.created_by}
        <Status border color="light" ps="1">
          <Avatar style="width: 1.25rem; height: 1.25rem" shape="circle">
            <img alt="user" src="/files/{item.created_by.profile}" />
          </Avatar>
          <El tag="strong">{item.created_by.username}</El>
        </Status>
      {:else}
        <Status border color="light">Unknown</Status>
      {/if}
    </ListItem>
    <ListItem style="width: 0" name={t('content.actions')}>
      <El d="flex" gap="2">
        <Button size="sm" on:click={() => onView(item)}>
          <Icon name="eye" />
        </Button>
        <Button color="primary" size="sm" on:click={() => onEdit(item)}>
          <Icon name="pencil" />
        </Button>
        <!-- <Button color="cyan" size="sm">
          <Icon name="history" />
        </Button> -->

        <Button color="danger" size="sm" on:click={() => removeItem(item)}>
          <Icon name="trash" />
        </Button>
      </El>
    </ListItem>
    <El gap="2" d="flex" justifyContent="end" px="3" py="2" slot="end">HELLO Ubuilder CMS</El>
  </ListBox>
</Page>
