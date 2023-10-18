<script>
    import Page from '$lib/components/core/Page.svelte'
  import { Alert, El } from 'yesvelte';
    export let data;
</script>

<Page title="داشبورد">
<b>سلام {data.user.name},<br/></b>
به سیستم مدیریت محتوای یوبیلدر خوش آمدید
</Page>
