<script lang="ts">
  import { Badge } from "yesvelte";

  export let table: string;
  export let title: string;
  export let value: any;
</script>

<div>
  <Badge href="/admin/data/{table}/{value}" color="info" ghost my="1">
    {value[title]}
  </Badge>
</div>
