<script>
    import {page} from '$app/stores'
  import Page from '$lib/components/core/Page.svelte';
</script>

<Page title="Table: {$page.params.table}">

View Data of {$page.params.table}
</Page>
