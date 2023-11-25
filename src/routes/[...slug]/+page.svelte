<script>
  import '../../typography.css'
  export let data
  console.log({ data })
</script>

<svelte:head>
  {@html data.page.head ?? ''}
  <title>{data.page.title}</title>
  <meta name="description" content={data.page.description} />

  <!-- <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script> -->
  <!-- <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script> -->
  <script>
  </script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelector('body').classList.add('@container')
    })
  </script>
  <script src="/cdn.tailwindcss.com.js"></script>
  <script src="/containerQuery.js"></script>
</svelte:head>

{#if false}
  <pre>
    {JSON.stringify(data, null, 2)}
  </pre>
{/if}

{#key JSON.stringify(data)}
  {#if data.page.dir === 'rtl'}
    <div style="display: contents;" dir="rtl">
      {@html data.html}
    </div>
  {:else}
    {@html data.html}
  {/if}
{/key}
