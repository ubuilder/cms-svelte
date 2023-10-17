<script>
  import { components } from "$lib/ui";
  import { page } from "$app/stores";
  import "yesvelte/css/tabler.min.css";
  export let data;
</script>

<svelte:head>
  <title>{data.page.title}</title>
  <meta name="description" content={data.page.description} />
</svelte:head>

{#if true}
  <pre>
    {JSON.stringify(data.page, null, 2)}
  </pre>
{/if}

{#key $page.url.pathname}
  <div style="height: 100%;" dir={data.page.dir}>
    {@html data.html}
  </div>
{/key}
