<script>
  import { components, Element } from "$lib/ui";
  import {page} from '$app/stores'
  import 'yesvelte/css/tabler.min.css'
  export let data;
</script>

<svelte:head>
  <title>{data.page.title}</title>
  <meta name="description" content={data.page.description} />
</svelte:head>

{#if false}
  <pre>
    {JSON.stringify(data.page, null, 2)}
  </pre> 
{/if}

{#key $page.url.pathname}
<div style="height: 100%;" dir={data.page.dir}>
  {#each data.page.slot as element}
    <Element {element} items={data.items} {components} mode="view"/>
  {/each}
</div>
{/key}