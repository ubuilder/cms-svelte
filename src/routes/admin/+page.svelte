<script>
  import {ButtonList, Page, Button, El, StatusItem} from '@ulibs/yesvelte' 
  
  export let data;

  function openExportModal() {
    console.log("openExportModal");
  }

  function openImportModal() {
    console.log("openImportModal");
  }
</script>

<Page title="داشبورد">

  <ButtonList slot="header-buttons">
    <Button color="azure" on:click={() => openImportModal()}>Import</Button>
    <Button color="success" on:click={() => openExportModal()}>Export</Button>
  </ButtonList>

  <El my="2" fontSize="3">
   <b>سلام {data.user.name},<br/></b>
به سیستم مدیریت محتوای یوبیلدر خوش آمدید
  </El>

  <El row pt="4">
    <StatusItem
      icon="file"
      color="success"
      title="Page Count"
      value={data.page_count}
    />
    <StatusItem
      icon="database"
      color="warning"
      title="Table Count"
      value={data.table_count}
    />
    <StatusItem
      icon="columns"
      color="danger"
      title="Total Rows"
      value={data.total_rows}
    />
    <StatusItem
      icon="photo"
      color="info"
      title="File Count"
      value={data.file_count}
    />
  </El>

</Page>
