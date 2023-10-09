<script lang="ts">
  import { Button } from "yesvelte";

  export let props: any = {};

  function onClick() {
    if(props.type === 'click')
    console.log('run action')
  }

  export let items: any = {};
</script>

{JSON.stringify(props)}
<Button type={props.type} color={props.color} {...$$restProps} on:click={(e) => onClick(e)}>
  {props.text}
</Button>
