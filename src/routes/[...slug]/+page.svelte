<script>
  import { components, Element } from "$lib/ui";
  import 'yesvelte/css/tabler.min.css'
  export let data;
</script>

<svelte:head>
  <title>{data.page.title}</title>
  <meta name="description" content={data.page.description} />
</svelte:head>

{#key data.page.id}
<div style="height: 100%;" dir={data.page.dir}>
  {#each data.page.slot as element}
    <Element {element} items={data.items} {components} mode="view"/>
  {/each}
</div>
{/key}