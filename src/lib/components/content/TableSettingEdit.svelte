<script lang="ts">
  import { Button, ButtonList, Page } from '@ulibs/yesvelte'
  import TableEditCard from './TableEditCard.svelte'

  export let table = {}
  console.log('table: ', table)
</script>

<Page>
  <PageHeader slot ='header' title="Edit Table">
    <Button on:click={() => (leftOffcanvasOpen = false)}>Cancel</Button>
    <Button on:click={() => removeTable()} color="danger" bgColor="red">Remove</Button>
    <Button on:click={() => updateTable()} color="primary" bgColor="blue">Update</Button>
  </PageHeader>
  {#if table}
    <TableEditCard bind:table />
  {/if}
</Page>

<!-- <ContentPage
        on:remove={(e) => removeFile(e.detail)}
        on:update={(e) => updateFile(e.detail)}
        on:upload={onUpload}

        {assets} />   -->
