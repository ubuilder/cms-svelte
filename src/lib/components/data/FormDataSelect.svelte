<script lang="ts">
  import { onMount } from "svelte";
  import { FormAutocomplete } from "yesvelte";
  
  export let multiple = false
  export let table: string | undefined = undefined
  export let title: string | undefined = undefined
  
  export let value: any;

  let items: any[] = []

  onMount(async () => {
    const data = await fetch(`/items/${table}`).then(res => res.json())

    items = data.data
  })
  

</script>

{#if items.length}
<FormAutocomplete {multiple} {items} key="id" {...$$restProps} bind:value let:item>
    {item[title ?? 'id']}
</FormAutocomplete>
{:else}
Loading...
{/if}