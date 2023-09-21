<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";


  import Modal from "$lib/components/core/modal/Modal.svelte";
  import FieldInput from "$lib/components/data/FieldInput.svelte";
  import { Button, El, FormDatePicker, FormEditor, FormFileUpload, FormInput, FormSwitch, FormTextarea } from "yesvelte";

  export let data: any = {}
  
  export let submitText = 'Insert'
  export let table: any;
  
  export let title: string;

</script>
<Modal {title}>

    <El row slot="body">
        {#each table.fields as field}
            <FieldInput {field} bind:data/>
         {/each}
    </El>
    <ButtonList slot="footer" justifyContent="end">
        <Button on:click={() => $modal.close()}>Cancel</Button>
        <Button color="primary" on:click={() => $modal.resolve(data)}>{submitText}</Button>
    </ButtonList>

</Modal>