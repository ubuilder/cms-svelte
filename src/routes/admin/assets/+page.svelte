<script>
    import Page from '$lib/components/core/Page.svelte'
  import Filter from '$lib/components/filters/Filter.svelte';
  import FilterList from '$lib/components/filters/FilterList.svelte';
  import { Button, Card, CardBody, Icon } from 'yesvelte';

  let filters = {}
</script>
<Page title="Assets">
    <Button color="primary" slot="header-buttons">
        <Icon name="upload"/>
        Upload
    </Button>

    <FilterList>
        <Filter type="select" key="type" items={[
            { text: "Image", key: "image" },
            { text: "Audio", key: "audio" },
            { text: "Video", key: "video" },
          ]} text="Type"/>
        <Filter type="text" key="name" text="Name"/>
    </FilterList>

    Content of Assets page
</Page>