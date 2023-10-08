<script lang="ts">
  import { Button } from "yesvelte";

  export let props: any = {};


  export let items: any = {};
</script>

{JSON.stringify(props)}
<Button type={props.type} color={props.color} {...$$restProps}>
  {props.text}
</Button>
