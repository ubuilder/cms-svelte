<script>
  import {ButtonList, Page, Button, Layout, El, StatusItem, FormField, Dropdown, Avatar, DropdownItem, DropdownMenu, Icon, modal} from '@ulibs/yesvelte' 
  import { t } from '$lib/i18n';
	import PageItem from './[page_id]/pages/PageItem.svelte'
	import AdminLayout from '$lib/components/AdminLayout.svelte'
	import AddPageModal from './[page_id]/pages/AddPageModal.svelte'
	import { goto } from '$app/navigation'
	import { api } from '$lib/helpers/api'
  
  export let data;

  function openExportModal() {
    console.log("openExportModal");
  }

  function openImportModal() {
    console.log("openImportModal");
  }

  async function createPage() {
    const page = await modal.open(AddPageModal, {
      page: {}
    })

    api('/pages', {data: page}).then(res => {
      goto('/edit/' + res.data.id)
    })
  }

</script>
<AdminLayout {...data}>

<Page title="{t("dashboard.title")}">

  <ButtonList slot="header-buttons">
    <Button color="primary" on:click={createPage}>{t('pages.add_page')}</Button>
    <!-- <Button color="azure" on:click={() => openImportModal()}>{t('buttons.import')}</Button>
    <Button color="success" on:click={() => openExportModal()}>{t('buttons.export')}</Button> -->
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

</AdminLayout>
