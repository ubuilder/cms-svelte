<script>
  export let data
</script>

<svelte:head>
	<title>{data.page.title}</title>
	<meta name="description" content={data.page.description} />
	{@html data.page.head}
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
