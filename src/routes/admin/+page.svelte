<script>
    import Page from '$lib/components/core/Page.svelte'
  import { Alert, El } from 'yesvelte';
    export let data;
</script>

<Page title="Dashboard">
<b>Hello {data.user.name},<br/></b>
Welcome to UBuilder CMS

</Page>
