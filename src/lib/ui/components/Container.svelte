<script>
  import { El } from "yesvelte";

  export let size = true

</script>
<El container={size}>
    <slot/>
</El>