<script lang="ts">
  import { t } from "$lib/i18n";
  import { Page, FilterList, TextFilter, Button, Card, CardBody, El, Icon } from "@ulibs/yesvelte";
  export let data;
</script>

<Page title={t('content.title')}>
  <Button href="./create" slot="header-buttons" color="primary">
    <Icon name="plus" />
    {t('content.create_table')}
  </Button>

  <FilterList>
    <TextFilter key="name" text={t('content.filters.name')} />
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
