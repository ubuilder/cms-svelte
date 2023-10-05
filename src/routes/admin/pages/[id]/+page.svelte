<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Page from "$lib/components/core/Page.svelte";
  import { createEventDispatcher, setContext } from "svelte";
  import { modal } from "$lib/components/core/modal";
  import { Button, FormField, El, FormInput } from "yesvelte";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import SlotList from "$lib/ui/SlotList.svelte";
  import PreviewModal from "./PreviewModal.svelte";
  import { writable } from "svelte/store";
  import PageLoad from "$lib/components/core/pages/PageLoad.svelte";

  export let data;
  console.log("data", data);

  let request: any = data.page;

  function onMove(detail) {
    console.log("onMove", detail);
    console.log(request.slot.map((x) => x.type));

    if (detail.from.length === 0 && detail.to.length === 0) {
      // swap elements

      if (detail.fromIndex < detail.toIndex) {
        detail.toIndex = detail.toIndex - 1;
      }

      const item = request.slot.splice(detail.fromIndex, 1);
      request.slot = [
        ...request.slot.slice(0, detail.toIndex),
        item[0],
        ...request.slot.slice(detail.toIndex),
      ];

      update();
    }
  }

  function update() {
    fetch("?/updatePage", {
      method: "POST",
      body: JSON.stringify(request),
    }).then((res) => invalidateAll());
  }
  async function openPreviewModal() {
    await modal.open(
      PreviewModal,
      {
        slug: request.slug,
        title: request.title,
      },
      {
        size: "lg",
      }
    );
  }

  function updatePage() {
    fetch("?/updatePage", {
      method: "POST",
      body: JSON.stringify(request),
    }).then((res) => invalidateAll());
  }

  function getItems(load: any) {
    let items: any = {
      page: {
        text: "Page",
        type: "object",
        content: {
          slug: {
            text: "Page's Slug",
            type: "plain_text",
          },
        },
      },
    };

    console.log('load: ', load)
    for (let item of load) {
      const table = data.tables.find((x) => x.slug === item.table);
      if(!table) continue;

      const fields: any = {};
      for (let field of table.fields) {
        const text = 
        fields[field.name] = {
          text: `${item.name}'s ${field.name}`,
          type: field.type,
        };

        if (field.type === "relation") {
          const otherTable = data.tables.find((x) => x.slug === field.table);
          const otherFields: any = {};
          for (let otherField of otherTable.fields) {
            otherFields[otherField.name] = {
              text: `${item.name} ${field.name} ${otherField.name}`,
              type: otherField.type,
            }
          }

          fields[field.name].content = otherFields;
          fields[field.name].type = field.multiple ? "array" : "object";

        }

        if(field.type === 'image' || field.type === 'file') {
          // alt, url, caption from assets....
        }

      }

      items[item.name] = {
        type: item.multiple ? "array" : "object",
        text: item.name,
        content: fields,
      };
    }

    console.log(items)
    return items;
  }
</script>

<Page title="Update Page '{data.page.title}'">
  <Button on:click={openPreviewModal} color="primary" slot="header-buttons">
    Preview
  </Button>
  <El row>
    <FormInput bind:value={request.title} label="Title" />

    <FormInput bind:value={request.slug} label="Slug" />

    <PageLoad bind:load={request.load} bind:tables={data.tables} />

    <FormField label="Content">
      <SlotList
        id="slot"
        items={getItems(request.load)}
        on:move={onMove}
        bind:slots={request.slot}
      />
    </FormField>

    <El col justifyContent="end" w="100" d="flex" my="2">
      <ButtonList ms="auto">
        <Button href="/admin/pages">Cancel</Button>
        <Button on:click={updatePage} color="primary">Save</Button>
      </ButtonList>
    </El>
  </El>
</Page>

<style>
  :global(.y-el-p-0 .y-accordion-body-inner) {
    padding: 0;
  }
  :global(.y-el-p-0 .y-accordion-header-button) {
    padding: 0;
  }
  :global(.y-accordion-header-button::after) {
    content: unset;
  }
</style>
