<script>
  import { components, Element } from "$lib/ui";
  export let data;
</script>

<svelte:head>
  <title>{data.page.title}</title>
  <meta name="description" content={data.page.description} />
  <link rel="stylesheet" href="node_modules/yesvelte/css/tabler.min.css" />
</svelte:head>
{#each data.page.slot as element}
  <Element {element} items={data.items} {components} />
{/each}
