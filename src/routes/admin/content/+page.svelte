<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import { Button, Card, CardBody, El, Icon } from "yesvelte";
  import TextFilter from "$lib/components/filters/TextFilter.svelte";
  export let data;
</script>

<Page title="Content">
  <Button href="./create" slot="header-buttons" color="primary">
    <Icon name="plus" />
    Create Table
  </Button>

  <FilterList>
    <TextFilter key="name" text="Name" />
  </FilterList>

  <El row>
    {#each data.tables as table}
      <El mb="2" col="12" colMd="6" colLg="4" colXl="3">
        <a href="./{table.slug}">
          <Card>
            <CardBody d="flex" alignItems="center" justifyContent="between">
              <El d="flex" gap="3" alignItems="center">
                <Icon size="lg" name={table.icon} />
                {table.name}
              </El>
            </CardBody>
          </Card>
        </a>
      </El>
    {/each}
  </El>
</Page>
