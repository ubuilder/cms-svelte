<script>
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import Page from "$lib/components/core/Page.svelte";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import SelectFilter from "$lib/components/filters/SelectFilter.svelte";
  import TextFilter from "$lib/components/filters/TextFilter.svelte";
  import { Button, ButtonGroup, Icon } from "yesvelte";

</script>

<Page title="Pages">
  <ButtonList slot="header-buttons">
    <Button href="/admin/pages/add" color="primary">
        <Icon name="plus"/>
        Add Page
    </Button>
  </ButtonList>
  <FilterList>
    <SelectFilter text="Type" key="is_template" items={[
      { key: true, text: 'Template' },      
      { key: false, text: 'Page' },
      ]}/>

      <TextFilter  text="Title" key="title"/>
      
      <SelectFilter text="Theme" key="theme" items={[
        { key: 'daisyui', text: 'Daisy UI' },      
        { key: 'tabler', text: 'Tabler' },
        ]}/>
  
  </FilterList>

</Page>