<script>
  import { CardBody } from 'yesvelte'

  export let data
</script>

<svelte:head>
	{@html data.page.head ?? ''}
	<title>{data.page.title}</title>
	<meta name="description" content={data.page.description} />

	<!-- <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script> -->
	<script>
	
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
{#if data.page.dir === 'rtl' }
	<div style="display: contents;" dir='rtl'>
		{@html data.html}
	</div>
  {:else }
    {@html data.html}
  {/if}
{/key}
