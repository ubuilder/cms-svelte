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
  $:console.log("tabel inside dataView", {table})
  let row = table.selectedItem
  async function removeItem(item: any) {
    const choice = await confirmModal.open({
      status: 'danger',
      title: t('content.messages.remove_row'),
    })

    if (choice) {
     const res = await api(`/content/${table.id}`, { params: {id:item.id}, method: "DELETE" }).then(res =>res)
      alert.success(res.message)		
      await invalidateAll()
      goBack()
    }
  }

  const dispatch = createEventDispatcher()
  function close() {
    dispatch('close')
  }
  function onEdit(data){
    dispatch('data-edit', data)
  }
  function goBack(){
    dispatch('goBack')
  }


</script>

<Page title="{table.name} data ">
  <!-- <svelte:fragment slot="title">
    <Icon mb="2" size="xl" name={table.icon} me="1" />
    {table.name}
    <Button ghost color="secondary" href="./edit">
      <Icon name="settings" />
    </Button>
  </svelte:fragment> -->
  <ButtonList slot="header-buttons">
    <Button on:click={goBack}>
      <Icon name="chevron-left" />
      <!-- {t('buttons.back')} -->
    </Button>

    <Button on:click={()=>removeItem(row)} color="danger">
      <Icon name="x" />
      {t('buttons.remove')}
    </Button>
    <Button on:click={onEdit} color="primary">
      <Icon name="plus" />
      {t('buttons.update')}
    </Button>
  </ButtonList>
  <table>
    <tbody>
      {#each table.fields.filter((x) => x.show_in_list !== false) as field}
        <tr>
          <th>{field.name}: </th>
          <td>
            {#if field.type === 'switch'}
              <Switch disabled checked={row[field.name]} />
            {:else if field.type === 'select'}
              {#if row[field.name]}
                <Status color="light">{row[field.name]}</Status>
              {/if}
            {:else if field.type === 'image'}
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
              {row[field.name].substring(0, 100) + (row[field.name]?.length > 100 ? '...' : '')}
            {/if}
          </td>
        </tr>
      {/each}
      <tr>
        <th>Crated at:</th>
        <td>
          {new Date(row.created_at).toDateString()}
        </td>
      </tr>

      <tr>
        <th>Created By:</th>
        <td>
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
        </td>
      </tr>
    </tbody>
  </table>
</Page>
