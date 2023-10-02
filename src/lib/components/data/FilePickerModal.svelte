<script lang="ts">
  import { Button, El, Icon, ModalFooter, ModalHeader, ModalTitle } from "yesvelte";


  import Modal from "../core/modal/Modal.svelte";
  import FilterList from "../filters/FilterList.svelte";
  import SelectFilter from "../filters/SelectFilter.svelte";
  import TextFilter from "../filters/TextFilter.svelte";
  import { currentModal } from "../core/modal/modal";

  let uploadInput: HTMLInputElement;

    export let type = 'file'


    function onSubmit() {
        
    }
    
    $: title = type === 'image' ? 'Choose Image' : 'Choose File'

</script>
<Modal >
    <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <Button
        on:click={() => uploadInput.click()}
        color="primary"
      >
        <Icon name="upload" />
        Upload
      </Button>
    </ModalHeader>
      <!-- Upload file form -->
  <El d="none">
    <input
      name="file"
      type="file"
      bind:this={uploadInput}
      on:change={onSubmit}
    />
  </El>


  <FilterList>
    Filters
    <!-- <SelectFilter
      key="type"
      items={[
        { text: "Image", key: "image" },
        { text: "Audio", key: "audio" },
        { text: "Video", key: "video" },
      ]}
      text="Type"
    />
    <TextFilter key="name" text="Name" /> -->
  </FilterList>

  <ModalFooter>
    <Button on:click={() => $currentModal.close()}>Close</Button>
  </ModalFooter>
</Modal>