<script lang="ts">
  import { El } from "yesvelte";

    export let title: string | undefined = undefined;

</script>
<El d="flex" mt="3" alignItems="center" justifyContent="between" {...$$restProps}>
    <El tag="h2" mb="0" style="font-size: 2rem;">{title}</El>

    <El d="flex" gap="2">
        <slot>
        </slot>
    </El>
</El>