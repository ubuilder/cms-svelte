<script>
  import { Button, El } from "yesvelte";

    export let page;
</script>


<El colSm="6" p="2" my="2">
    {page.title}

    <Button href="/admin/pages/{page.id}">Edit</Button>
</El>