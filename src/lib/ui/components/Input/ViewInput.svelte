<script lang="ts">

  import { FormInput } from "@ulibs/yesvelte";
  export let props: any = {}

</script>

<FormInput
label={props.label}
type={props.type}
name={props.name}
{...$$restProps}
value={props.value ?? props.defaultValue} />