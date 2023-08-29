<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";


  import Modal from "$lib/components/core/modal/Modal.svelte";
  import { Button, El, FormInput } from "yesvelte";

  export let data: any = {}
  
  export let submitText = 'Insert'
  export let table: any;
  
  export let title: string;

</script>
<Modal {title}>

    <El row slot="body">
        {#each table.fields as field}
            <FormInput col=12 colSm=12 colMd=12 colLg=12 colXl=12 label={field.name} bind:value={data[field.name]}/>
        {/each}
    </El>
    <ButtonList slot="footer" justifyContent="end">
        <Button on:click={() => $modal.close()}>Cancel</Button>
        <Button color="primary" on:click={() => $modal.resolve(data)}>{submitText}</Button>
    </ButtonList>

</Modal>