<script lang="ts">
  import {
    Button,
    El,
    Icon,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    BaseModal,
    FilterList,
    SelectFilter,
    TextFilter,
    modal,
  } from "@ulibs/yesvelte";

  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import ModalAssetItem from "./ModalAssetItem.svelte";
  import type { AssetType } from "$lib/types/asset";
  import { api } from "$lib/helpers/api"

  let assets: AssetType[] = [];
  let uploadInput: HTMLInputElement;

  export let multiple = false;
  export let type = "file";

  async function onSubmit(event: any) {
    const formData = new FormData();

    formData.append("file", event.target.files[0]);

    console.log('uploading....')
    const result = await api("/assets", {
      formData,
    })
    
    console.log('uploaded')
    // await invalidateAll();
    await loadAssets(filters);
  }
  async function loadAssets(filters: any) {
    console.log(filters);
    const filtersObject: any = {};

    Object.keys(filters).map((x) => {
      if (filters[x].value) {
        filtersObject[x] = filters[x];
      }
    });

    assets = await api("/assets", {
      params: {
        filters: filtersObject,
      }
    }).then(res => res.data);
  }

  let title: string;
  $: title = type === "image" ? "Choose Image" : "Choose File";
  $: title = multiple ? title + "s" : title;

  const filters = writable({
    // type: {
    //   operator: "=",
    //   value: type ?? 'file',
    // },
  });
  setContext("FILTERS", filters);

  $: loadAssets($filters);
</script>

<BaseModal>
  <ModalHeader pe="4">
    <ModalTitle>{title}</ModalTitle>
    <Button on:click={() => uploadInput.click()} color="primary">
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

  <ModalBody class="min-h-[400px]">
    <FilterList>
      
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
            <El on:click={() => $modal.resolve(asset.id)} col="6" colMd="4" colLg="3"  border
            borderRoundSize="3"
       d="flex" style="flex-direction: column;" bgColor="secondary" bgOpacity="10" p="3">
              <Icon mx="auto" mb="3" size="3x" name="file"/>
              <El>
                {asset.name}

              </El>
            </El>
        {/if}
      {/each}
    </El>
  </ModalBody>

  <ModalFooter>
    <Button on:click={() => $modal.close()}>Close</Button>
  </ModalFooter>
</BaseModal>
