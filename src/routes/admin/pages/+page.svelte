<script>
    import { invalidateAll } from "$app/navigation";

  import {Page, FilterList, SelectFilter, TextFilter, Button, Icon, modal, ButtonList} from "@ulibs/yesvelte";

  import PageItem from "./PageItem.svelte";
  import AddPageModal from "./AddPageModal.svelte";
	import { t } from "$lib/i18n"

  export let data;
  
  async function addPage() {
    const page = await modal.open(AddPageModal, {
      
    })

    if(page) {
      fetch('?/addPage', {
        method: 'POST',
        body: JSON.stringify(page)
      }).then(res => invalidateAll())
    }
  }

</script>

<Page title={t("pages.title")}>
  <ButtonList slot="header-buttons">
    <Button on:click={() => addPage()} color="primary">
        <Icon name="plus"/>
        {t('pages.add_page')}
    </Button>
  </ButtonList>
  <FilterList>
    <!-- <SelectFilter text="Type" key="is_template" items={[
      { key: true, text: 'Template' },      
      { key: false, text: 'Page' },
      ]}/> -->

      <TextFilter  text="Title" key="title"/>
      <!-- <SelectFilter text="Theme" key="theme" items={[
        { key: 'daisyui', text: 'Daisy UI' },      
        { key: 'tabler', text: 'Tabler' },
        ]}/> -->
  </FilterList>
  {#each data.pages as page}
    <PageItem {page}/>
  {/each}
</Page>