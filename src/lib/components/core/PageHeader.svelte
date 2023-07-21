<script lang="ts">
  import { El } from "yesvelte";

    export let title: string | undefined = undefined;

</script>
<El d="flex" my="3" px="3" justifyContent="between">
    <El tag="h2">{title}</El>

    <El d="flex" gap="2">
        <slot>
        </slot>
    </El>
</El>