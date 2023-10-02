<script lang="ts">

  import {Button} from "yesvelte";
  import { modal } from "../core/modal";
  import FilePickerModal from "./FilePickerModal.svelte";

  export let type: 'image' | 'video' | 'file' = 'file'

  export let value: string;


  function openFilePicker() {
    const file_id = modal.open(FilePickerModal, {
        type,
    }, {
        size: 'lg',
        backdrop: true
    })

    console.log(file_id)
  }

</script>

{#if value}
    {#if type === 'image'}
        <img src="/files/{value}" alt="test"/>
    {:else}
        Type
    {/if}
{:else}
<Button on:click={openFilePicker}>

{#if type === 'image'}
Choose Image
{:else}
Choose File
{/if}
    
</Button>
{/if}

