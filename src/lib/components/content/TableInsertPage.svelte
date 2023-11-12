<script lang="ts">
    import { Button, Page, PageHeader, alert } from '@ulibs/yesvelte'
    import TableEditCard from './TableEditCard.svelte'
    import { api } from '$lib/helpers/api'
    import { createEventDispatcher } from 'svelte'
  
    let title = "Create Table"
    let table = {}

    const dispatch = createEventDispatcher()

    async function createTable() {
      const res = await api('/tables', { data: table}).then((res) => res)
      alert.success(res.message)
      dispatch('reload', ['tables'])
      close()
    }
  
    function close() {
      dispatch('close')
    }
  </script>
  
  <Page>
    <PageHeader slot="header" {title}>
      <Button on:click={close}>Cancel</Button>
      <Button on:click={() => createTable()} color="primary" bgColor="blue">Create</Button>
    </PageHeader>
    {#if table}
      <TableEditCard bind:table />
    {/if}
  </Page>
  