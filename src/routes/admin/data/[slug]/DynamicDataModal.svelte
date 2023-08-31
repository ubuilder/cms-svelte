<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";


  import Modal from "$lib/components/core/modal/Modal.svelte";
  import { Button, El, FormDatePicker, FormEditor, FormFileUpload, FormInput, FormSwitch, FormTextarea } from "yesvelte";

  export let data: any = {}
  
  export let submitText = 'Insert'
  export let table: any;
  
  export let title: string;

</script>
<Modal {title}>

    <El row slot="body">
        {#each table.fields as field}
            {@const props = {col: "12", required: field.required, label: field.name}}
            {#if field.type === 'plain_text'}
                {#if field.input_type === 'textarea'}
                    <FormTextarea rows=10 {...props} bind:value={data[field.name]}/>
                {:else}
                    <FormInput {...props} minlength={field.minlength} maxlength={field.maxlength} bind:value={data[field.name]}/>
                {/if}
            {:else if field.type === 'rich_text'}
                <FormEditor {...props} bind:value={data[field.name]}/>
            {:else if field.type === 'number'}
                <FormInput {...props} type="number" min={field.min} max={field.max} bind:value={data[field.name]}/>
            {:else if field.type === 'date_time'}
                <FormDatePicker {...props} range={field.range} bind:value={data[field.name]}/>
                
            {:else if field.type === 'file'}
                <!-- <FormFileUpload {...props} label="use Asset picker (check multiple)" bind:value={data[field.name]}/> -->
                
            {:else if field.type === 'image'}
                <!-- <FormFileUpload {...props} label="use Asset picker (check multiple)" bind:value={data[field.name]}/> -->
                
            {:else if field.type === 'switch'}
                <FormSwitch {...props} bind:checked={data[field.name]}/>

            {:else}
            NOT SUPPORTED {field.type}
            {/if}
        {/each}
    </El>
    <ButtonList slot="footer" justifyContent="end">
        <Button on:click={() => $modal.close()}>Cancel</Button>
        <Button color="primary" on:click={() => $modal.resolve(data)}>{submitText}</Button>
    </ButtonList>

</Modal>