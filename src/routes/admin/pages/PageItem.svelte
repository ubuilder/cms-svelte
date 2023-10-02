<script>
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { Button, El } from "yesvelte";

    export let page;
</script>


<El border bgColor="light" p="3" my="2">
    {page.title}
    <El tag="small">
      (/{page.slug})
    </El>

    <El mt="3"/>
    <ButtonList>

    <Button ms="auto" color="primary" href="/admin/pages/{page.id}">Edit</Button>
    <Button href="/admin/pages/editor/{page.id}">Edit</Button>
  </ButtonList>

</El>