<script>
  import {ButtonList, Page, Button, El, StatusItem, FormField} from '@ulibs/yesvelte' 
  import { t } from '$lib/i18n';
	import PageItem from './[page_id]/pages/PageItem.svelte'
  
  export let data;

  function openExportModal() {
    console.log("openExportModal");
  }

  function openImportModal() {
    console.log("openImportModal");
  }
</script>

<Page title="{t("dashboard.title")}" theme={data.theme} dir={data.dir}>

  <ButtonList slot="header-buttons">
    <Button color="azure" on:click={() => openImportModal()}>{t('buttons.import')}</Button>
    <Button color="success" on:click={() => openExportModal()}>{t('buttons.export')}</Button>
  </ButtonList>

  <El my="2" fontSize="3">
   <b>{t('dashboard.hello')} {data.user.name},</b>
   <br/>
    {t('dashboard.welcome_message')}
  </El>

  <El row pt="4">
    <StatusItem
      icon="file"
      color="success"
      title={t('dashboard.page_count')}                                                  
      value={data.page_count}
    />
    <StatusItem
      icon="database"
      color="warning"
      title={t('dashboard.table_count')}
      value={data.table_count}
    />
    <StatusItem
      icon="columns"
      color="danger"
      title={t('dashboard.rows_count')}
      value={data.total_rows}
    />
    <StatusItem
      icon="photo"
      color="info"
      title={t('dashboard.file_count')}
      value={data.file_count}
    />
  </El>
  <FormField label="Pages">
    {#each data.pages as page}
      <PageItem {page}/>
    {/each}
  </FormField>
  

</Page>
