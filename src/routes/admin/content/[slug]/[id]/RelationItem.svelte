<script lang="ts">
  import { Badge } from "yesvelte";

  export let table: string;
  export let title: string;
  export let value: any;
</script>

{#if value}
  <div>
    <Badge href="./{table}/{value.id}" color="info" ghost my="1">
      {value[title ?? "id"]}
    </Badge>
  </div>
{/if}
