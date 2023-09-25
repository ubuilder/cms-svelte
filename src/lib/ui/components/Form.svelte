<script context="module">
    export const hasSlot = true;    
</script>
<script lang="ts">
  import { FormInput, FormSelect } from "yesvelte";

    export let edit:any; 
    export let props:any = {}    
</script>

{#if edit}
<FormSelect class = 'u-component' bind:value={props.actionid} items={["create", "remove", "edit"]} let:item>
    {item}
</FormSelect>
{:else}
    <form action="/actions/{props.actionid}" method="post">

        <slot/>
    </form>

{/if}