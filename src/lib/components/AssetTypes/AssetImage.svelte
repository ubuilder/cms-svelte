<script lang="ts">
  import { El } from "@ulibs/yesvelte";

  export let asset: any;

</script>

<El tag="img" src="/files/{asset.id}" alt={asset.alt} style="object-fit: cover; height: 180px" w=100/> 
