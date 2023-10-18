<script>
  import { ButtonList, Button, El } from "@ulibs/yesvelte";

    export let page;
</script>


<El border class="page-item" p="3" my="3">
    {page.title}
    <El tag="small">
      (/{page.slug})
    </El>

    <El mt="3"/>
    <ButtonList>

    <Button ms="auto" color="primary" href="/admin/pages/{page.id}">Edit</Button>
    <!-- <Button href="/admin/pages/editor/{page.id}">Edit</Button> -->
  </ButtonList>

</El>