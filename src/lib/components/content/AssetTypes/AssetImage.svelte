<script lang="ts">
  import { El } from "yesvelte";

  export let asset: any;

</script>

<El tag="img" src="/files/{asset.id}" alt={asset.alt} style="object-fit: cover" w=100/> 
