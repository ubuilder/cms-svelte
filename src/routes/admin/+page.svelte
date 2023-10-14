<script>
  import StatusItem from "../../lib/components/dashboard/StatusItem.svelte";

  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import Page from "$lib/components/core/Page.svelte";
  import { Alert, Button, Card, CardBody, El, Icon } from "yesvelte";
  export let data;

  function openExportModal() {
    console.log("openExportModal");
  }

  function openImportModal() {
    console.log("openImportModal");
  }
</script>

<Page title="Dashboard">
  <ButtonList slot="header-buttons">
    <Button color="azure" on:click={() => openImportModal()}>Import</Button>
    <Button color="success" on:click={() => openExportModal()}>Export</Button>
  </ButtonList>

  <El my="2" fontSize="3">
    Hello <b>{data.user.name ?? data.user.username}</b>, Welcome to UBuilder CMS

  </El>

  <El row pt="4">
    <StatusItem
      icon="file"
      iconColor="success"
      title="Page Count"
      value={data.page_count}
    />
    <StatusItem
      icon="database"
      iconColor="warning"
      title="Table Count"
      value={data.table_count}
    />
    <StatusItem
      icon="columns"
      iconColor="danger"
      title="Total Rows"
      value={data.total_rows}
    />
    <StatusItem
      icon="photo"
      iconColor="info"
      title="File Count"
      value={data.file_count}
    />
  </El>

  Dashboard
</Page>
