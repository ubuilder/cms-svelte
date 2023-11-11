<script lang="ts">
    import { Button, Page, PageHeader, alert } from '@ulibs/yesvelte'
    import TableEditCard from './TableEditCard.svelte'
    import { api } from '$lib/helpers/api'
    import { createEventDispatcher } from 'svelte'
  
    export let table = {}
    async function remove() {
      const res = await api('/tables', { params: { id: table.id }, method: 'DELETE' }).then(
        (res) => res
      )
      alert.success(res.message)
      close()
    }
    async function insert() {
      const res = await api('/tables', { data: table, params: { id: table.id } }).then((res) => res)
      alert.success(res.message)
      close()
    }
  
    const dispatch = createEventDispatcher()
    function close() {
      dispatch('close')
    }
  </script>
  
  <Page>
    <PageHeader slot="header" title="Insert Data">
      <Button on:click={close}>Cancel</Button>
      <Button on:click={() => removeTable()} color="danger" bgColor="red">Remove</Button>
      <Button on:click={() => updateTable()} color="primary" bgColor="blue">Update</Button>
    </PageHeader>
  </Page>
  