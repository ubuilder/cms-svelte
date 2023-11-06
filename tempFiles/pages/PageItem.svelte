<script>
  import { ButtonList, Button, El } from "@ulibs/yesvelte";

    export let page;
</script>


<El tag="a" href="/edit/{page.id}" border class="page-item" p="3" my="3" d="flex" justifyContent="between">
  <El>
    <El mb="0" textColor="light" tag='h3'>
      {page.title}
    </El>
    <El tag="small">
      slug: (/{page.slug})
    </El>
  </El>

</El>