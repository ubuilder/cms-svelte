<script lang="ts">
  import { Page, FilterList, TextFilter, Button, Card, CardBody, El, Icon } from "@ulibs/yesvelte";
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
          <Card class="table-item">
            <CardBody d="flex" alignItems="center" justifyContent="between">
              <El d="flex" gap="3" alignItems="center">
                <Icon color="info" size="lg" name={table.icon} />
                {table.name}
              </El>
            </CardBody>
          </Card>
        </a>
      </El>
    {/each}
  </El>
</Page>
