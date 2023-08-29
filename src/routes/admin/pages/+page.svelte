<script>
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import Page from "$lib/components/core/Page.svelte";
  import Filter from "$lib/components/filters/Filter.svelte";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import { Button, ButtonGroup, Icon } from "yesvelte";

</script>

<Page title="Pages">
  <ButtonList slot="header-buttons">
    <Button color="primary">
        <Icon name="plus"/>
        Add Page
    </Button>
  </ButtonList>
  <FilterList>
    <Filter text="Type" key="is_template" items={[
      { key: true, text: 'Template' },      
      { key: false, text: 'Page' },
      ]}/>

      <Filter type="text" text="Title" key="title"/>
      
      <Filter text="Theme" key="theme" items={[
        { key: 'daisyui', text: 'Daisy UI' },      
        { key: 'tabler', text: 'Tabler' },
        ]}/>
  
  </FilterList>

</Page>