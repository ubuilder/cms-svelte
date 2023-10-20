<script>
  import { ButtonList, Button, El } from "@ulibs/yesvelte";

    export let page;
</script>


<El border class="page-item" p="3" my="3" d="flex" justifyContent="between">
  <El>
    <El mb="0" tag='h3'>
      {page.title}
    </El>
    <El tag="small">
      slug: (/{page.slug})
    </El>
  </El>
  <ButtonList>

    <Button ms="auto" color="primary" href="/admin/pages/{page.id}">Edit</Button>
    <!-- <Button href="/admin/pages/editor/{page.id}">Edit</Button> -->
  </ButtonList>

</El>