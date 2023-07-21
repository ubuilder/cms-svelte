<script>
    import {page} from '$app/stores'
    import Page from '$lib/components/core/Page.svelte'
</script>

<Page title="Page: {$page.params.page}">

    View Page {$page.params.page}
</Page>
    