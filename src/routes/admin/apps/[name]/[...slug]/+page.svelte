<script>
    import {page} from '$app/stores'
  import Loading from '$lib/components/core/loading/Loading.svelte';

  export let data;
    let loading = true;

</script>

<!-- <h1>Home page of an app </h1> -->
<div class="wrapper">

<iframe style:width="100%" title={data.app.name} src={data.app.url + '/' + data.slug} frameborder="0"></iframe>
<!-- <Loading absolute show={loading}/> -->
</div>

<style>
    .wrapper {
        position: relative;
        width: 100%;
        height: calc(100% - 5px);
    }
    .wrapper iframe {
        width: 100%;
        height: 100%;
    }
</style>