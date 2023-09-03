<script>
    import {components, Element} from '$lib/ui'
    export let data;
</script>
<svelte:head>
    <title>{data.page.props.title}</title>
    <meta name="description" content={data.page.props.description}/>
    <link rel="stylesheet" href="node_modules/yesvelte/css/{data.page.props.theme}.min.css"/>
</svelte:head>
{#each data.page.slot as element}
    <Element {element} {components}/>
{/each}