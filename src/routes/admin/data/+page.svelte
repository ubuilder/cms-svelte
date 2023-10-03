<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import { modal } from "$lib/components/core/modal";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import { Button, Card, CardBody, El, Icon } from "yesvelte";
  import TableEditModal from "./TableEditModal.svelte";
  import { invalidateAll } from "$app/navigation";
  import TextFilter from "$lib/components/filters/TextFilter.svelte";

  export let data;

  async function createTable() {
    const res = await modal.open(TableEditModal, {
      table: {
        icon: "database",
        name: "",
        fields: [],
      },
      tables: data.tables,
      submitText: 'Create'
    });

    if (res) {
      await fetch("?/create", {
        method: "POST",
        body: JSON.stringify(res),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }

  async function editTable(table: any) {
    const res = await modal.open(TableEditModal, {
      table,
      title: "Edit Table",
      tables: data.tables,
      submitText: "Update",
    });

    if (res) {
      await fetch("?/update", {
        method: "POST",
        body: JSON.stringify(res),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }

</script>
<Page title="Tables">
  <Button on:click={() => createTable()} slot="header-buttons" color="primary">
    <Icon name="plus" /> Create Table
  </Button>

  <FilterList>
    <TextFilter key="name" text="Name" />
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
