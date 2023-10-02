<script lang="ts">
  import { Button } from "yesvelte";
  import { modal } from "../core/modal";
  import FilePickerModal from "./FilePickerModal.svelte";
  import ButtonList from "../core/ButtonList.svelte";

  export let type: "image" | "video" | "file" = "file";

  export let value: string | undefined = undefined;

  async function openFilePicker() {
    const file_id = await modal.open(
      FilePickerModal,
      {
        type,
      },
      {
        size: "lg",
        backdrop: true,
      }
    );

    if(file_id) {
        value = file_id
    }

    console.log(file_id);
  }
</script>

{#if value}
  {#if type === "image"}
  <Button on:click={() => openFilePicker()}>Replace Image</Button>
  <Button on:click={() => value = null} color="danger">Remove Image</Button>
    <img src="/files/{value}" alt="test" />
  {:else}
    Type
  {/if}
{:else}
<ButtonList>

  <Button on:click={openFilePicker}>
    {#if type === "image"}
      Choose Image
    {:else}
      Choose File
    {/if}
  </Button>
</ButtonList>

{/if}
