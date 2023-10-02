<script lang="ts">
  import { Button, El, Icon, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "yesvelte";


  import Modal from "../core/modal/Modal.svelte";
  import FilterList from "../filters/FilterList.svelte";
  import SelectFilter from "../filters/SelectFilter.svelte";
  import TextFilter from "../filters/TextFilter.svelte";
  import { modal } from "../core/modal/modal";
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import Asset from "../../../routes/admin/assets/Asset.svelte";
  import ModalAssetItem from "./ModalAssetItem.svelte";

  let uploadInput: HTMLInputElement;

    export let type = 'file'


    function onSubmit() {
      console.log('onSubmit')
        
    }
    async function loadAssets(filters: any) {
      console.log(filters);
      const filtersObject: any = {};

      Object.keys(filters).map(x => {
        if(filters[x].value) {
          filtersObject[x] = filters[x]
        }
      })

      const res = await fetch('/admin/assets/get' , {
        method: 'POST',
        body: JSON.stringify(filtersObject),
        headers: {
          'content-type': 'application/json'
        }
      })
      assets = await res.json().then(res => res.assets)
    }
    
    
    $: title = type === 'image' ? 'Choose Image' : 'Choose File'

    let assets: any[] = []

    const filters = writable({})
    setContext('FILTERS', filters)

    $: loadAssets($filters)
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

  <ModalBody>
    


  <FilterList>
    Filters
    <SelectFilter
      key="type"
      items={[
        { text: "Image", key: "image" },
        { text: "Audio", key: "audio" },
        { text: "Video", key: "video" },
      ]}
      text="Type"
    />
    <TextFilter key="name" text="Name" />
  </FilterList>

  <El row>
    {#each assets as asset}
      {#if asset.type === "image"}
        <ModalAssetItem on:select={() => $modal.resolve(asset.id)} {asset} />
      {:else}
        {JSON.stringify(asset)}
        <br />
      {/if}
    {/each}
  </El>
</ModalBody>

  <ModalFooter>
    <Button on:click={() => $modal.close()}>Close</Button>
  </ModalFooter>
</Modal>