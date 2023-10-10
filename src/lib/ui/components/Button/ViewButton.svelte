<script lang="ts">
  import { Button } from "yesvelte";

  export let props: any = {};

</script>

<Button type={props.type} color={props.color} {...$$restProps}>
  {props.text}
</Button>
