<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import { modal } from "$lib/components/core/modal";
  import Filter from "$lib/components/filters/Filter.svelte";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import { Button, Card, CardBody, El, Icon } from "yesvelte";
  import TableEditModal from "./TableEditModal.svelte";
  import { invalidateAll } from "$app/navigation";

  async function createTable() {
    const data = await modal.open(TableEditModal, {
      table: {
        icon: 'database',
        name: '',
        fields: []
      }
    })

    if(data) {
      await fetch('?/create', {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res => res.json())

      await invalidateAll()
    }
  }

  async function editTable(table: any) {
    const data = await modal.open(TableEditModal, {
      table,
      title: 'Edit Table'
    })

    if(data) {
      console.log(data)
    }
  }
  
  
  export let data;
</script>

<Page title="Tables">
  <Button on:click={() => createTable()} slot="header-buttons" color="primary"
    >
    <Icon name="plus" /> Create Table
    </Button
  >

  <FilterList>
    <Filter key="name" text="Name" type="text" />
  </FilterList>

  <El row>
    {#each data.tables as table}
      <El mb="2" col="12" colMd="6" colLg="4" colXl="3">
        <El tag="a" href="/admin/data/{table.slug}">
        <Card>
          <CardBody d="flex" alignItems="center" justifyContent="between">
            <El d="flex" gap="3" alignItems="center">
              <Icon size="lg" name={table.icon} />
              {table.name}
            </El>
            <Icon
              on:click!stopPropagation!preventDefault={() => editTable(table)}
              size="lg"
              name="settings"
            />
          </CardBody>
        </Card>
      </El>

      </El>
    {/each}
  </El>
</Page>
