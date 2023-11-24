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
    } from '@ulibs/yesvelte'
    import { invalidateAll } from '$app/navigation'
  
    import { t } from '$lib/i18n'
    import RelationItem from './RelationItem.svelte'
    import { createEventDispatcher, onMount } from 'svelte'
    import { api } from '$lib/helpers/api'
  
    export let table
    let row = table.selectedItem
    async function removeItem(item: any) {
      const choice = await confirmModal.open({
        status: 'danger',
        title: t('content.messages.remove_row'),
      })
  
      if (choice) {
        await fetch('?/remove', {
          method: 'POST',
          body: JSON.stringify({ id: item.id }),
        }).then((res) => res.json())
  
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
    // function onEdit(data){
    //   table.selectedItem = data
    //   dispatch('data-edit', data)
    // }
  
    // onMount(async () => {
    //   const res = await api(`/content/${table.id}`, {}).then((res) => res)
    //   rows = res.data?.data
    // })
  </script>
  
  <Page title={table.name}>
    <svelte:fragment slot="title">
      <Icon mb="2" size="xl" name={table.icon} me="1" />
      {table.name}
      <Button ghost color="secondary" href="./edit">
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
  
    <!-- <FilterList>
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
    </FilterList> -->

    <!-- <ListBox title="data view" items={[row]} let:item> -->
      {#each table.fields.filter((x) => x.show_in_list !== false) as field}
        <ListItem name={field.name}>
          {#if field.type === 'switch'}
          <div>{field.name}</div>
            <Switch disabled checked={row[field.name]} />
          {:else if field.type === 'select'}
            {#if row[field.name]}
            <div>{field.name}</div>
              <Status color="light">{row[field.name]}</Status>
            {/if}
          {:else if field.type === 'image'}
          <div>{field.name}</div>
            <El tag="img" width="64px" src="/files/{row[field.name]}" />
          {:else if field.type === 'relation'}
            {#if field.multiple}
              {#each row[field.name] as x}
              
                <RelationItem value={x} table={field.table} title={field.title} />
              {/each}
            {:else}
              <RelationItem value={row[field.name]} table={field.table} title={field.title} />
            {/if}
          {:else}
          <div>{field.name}</div>
            {row[field.name].substring(0, 100) + (row[field.name]?.length > 100 ? '...' : '')}
          {/if}
        </ListItem>
      {/each}
      <ListItem name={t('content.created_at')} style="white-space: nowrap;">
        {new Date(row.created_at).toDateString()}
      </ListItem>
  
      <ListItem name={t('content.created_by')}>
        {#if row.created_by}
          <Status border color="light" ps="1">
            <Avatar style="width: 1.25rem; height: 1.25rem" shape="circle">
              <img alt="user" src="/files/{row.created_by.profile}" />
            </Avatar>
            <El tag="strong">{row.created_by.username}</El>
          </Status>
        {:else}
          <Status border color="light">Unknown</Status>
        {/if}
      </ListItem>
      <ListItem style="width: 0" name={t('content.actions')}>
        <El d="flex" gap="2">
          <Button size="sm" href="../{table.slug}/{row.id}">
            <Icon name="eye" />
          </Button>
          <Button color="primary" size="sm" on:click = {()=>onEdit(row)}>
            <Icon name="pencil" />
          </Button>
          <Button color="cyan" size="sm" href="../{table.slug}/{row.id}/history">
            <Icon name="history" />
          </Button>
  
          <Button color="danger" size="sm" on:click={() => removeItem(row)}>
            <Icon name="trash" />
          </Button>
        </El>
      </ListItem>
      <El gap="2" d="flex" justifyContent="end" px="3" py="2" slot="end">HELLO</El>
    <!-- </ListBox>  -->
  </Page>
  