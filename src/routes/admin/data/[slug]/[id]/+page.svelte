
<script>
  import PageHeader from '$lib/components/core/PageHeader.svelte';
  import { Button, El, Icon } from 'yesvelte';

    export let data;
</script>


<PageHeader title="Preview {data.table.name} ({data.value.id})">
    <Button href="/admin/data/{data.table.slug}">
        <Icon name="chevron-left"/>
        Back
    </Button>    
</PageHeader>

<El container="lg" my="4">
{#each data.table.fields as field}
    <El my="2" d="flex">
        <div class="label">{field.name}:</div>
        <div class="value">{data.value[field.name]}</div>
    </El>
{/each}
</El>

<style>
    .label {
        font-weight: bold;
        font-size: 24px;
        width: 200px;
        display: block;
        text-align: end;
    }
    
    .value {
        font-size: 24px;
        margin-left: 1rem;
    }
</style>