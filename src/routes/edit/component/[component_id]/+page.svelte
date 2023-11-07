<script>
  import EditorLayout from "$lib/components/EditorLayout.svelte"


  export let data;

</script>
<EditorLayout theme={data.theme} dir={data.dir} component_id={data.component_id}>

</EditorLayout>