<script lang="ts">
  import { cms_api } from '$lib/helpers/cms-api.js';
  import { onMount } from 'svelte';

    import {Page , FormSelect,Button, FormTextarea, El, FormField} from "@ulibs/yesvelte"
    
    export let data;

    let loading = false;
    let api: ReturnType<typeof cms_api>;

    onMount(() => {
        api = cms_api({baseUrl: 'https://cms-api.hadiahmadi.dev/api/'+data.siteId, token: data.token})
    })
    
    let body: string = '{}'

    let result = ''
    let selectedItem: keyof typeof api;
    async function run() {
        loading = true
        result = await api[selectedItem](JSON.parse(body))
        loading = false
    }
</script>

<Page title="Test API">
    {#if api}
    <El row>

<FormSelect col="9" bind:value={selectedItem} items={Object.keys(api)} label="Method" let:item>
    {item}
</FormSelect>
<El col="3" mt="1">
    <Button w="100" mt="4" mb="3" {loading} color="primary" on:click={()=> run()}>Run</Button>

</El>

<FormTextarea col='12' label="Body" bind:value={body}/>

{#if result}
<FormField label="Response">
    <El border tag="pre" p="2" bgColor="light" textColor="dark">{JSON.stringify(result, null, 2)}</El>
</FormField>
{/if}

</El>
{/if}
</Page>

