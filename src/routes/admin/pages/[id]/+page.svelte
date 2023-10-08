<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import type { FieldRelation, Page as PageType } from "$lib/types";
  import Page from "$lib/components/core/Page.svelte";
  import { modal } from "$lib/components/core/modal";
  import {
    Button,
    FormField,
    El,
    FormInput,
    Tabs,
    TabList,
    TabItem,
    TabContent,
    TabPanel,
    FormTextarea,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Icon,
    FormRadioGroup,
  } from "yesvelte";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import SlotList from "$lib/ui/SlotList.svelte";
  import PreviewModal from "./PreviewModal.svelte";
  import { writable } from "svelte/store";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";
  import PageLoad from "$lib/components/core/pages/PageLoad.svelte";
  import { slots } from "$lib/stores/pageSlots";
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";

  export let data;
  let request: Partial<PageType> = data.page;

  //sets and syncs with slots store
  let flag = false;
  slots.subscribe((s) => {
    if (flag) {
      data.page.slot = s;
    }
  });
  $: {
    if ($slots !== data.page.slot) {
      if (data?.page?.slot) {
        slots.set(data.page.slot);
        flag = true;
      }
    }
  }

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
        autoClose: true,
      },
      {
        size: "lg",
        autoClose: true,
      }
    );
  }
  async function openRemoveConfirmModal() {
    const res = await modal.open(
      ConfirmModal,
      { status: "danger" },
      { autoClose: true }
    );
    if (res) {
      fetch("?/removePage", {
        method: "POST",
        body: JSON.stringify(request),
      }).then((res) => goto("/admin/pages"));
    }
  }

  function updatePage() {
    fetch("?/updatePage", {
      method: "POST",
      body: JSON.stringify(request),
    }).then((res) => invalidateAll());
  }

  function getItems(load: any): any[] {
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

    console.log("load: ", load);
    for (let item of load) {
      const table = data.tables.find((x) => x.slug === item.table);
      if (!table) continue;

      const fields: any = {};
      for (let field of table.fields) {
        fields[field.name] = {
          text: `${item.name}'s ${field.name}`,
          type: field.type,
        };

        if (field.type === "relation") {
          const otherTable = data.tables.find(
            (x) => x.slug === (field as FieldRelation).table
          );
          const otherFields: any = {};
          for (let otherField of otherTable.fields) {
            otherFields[otherField.name] = {
              text: `${item.name} ${field.name} ${otherField.name}`,
              type: otherField.type,
            };
          }

          fields[field.name].content = otherFields;
          fields[field.name].type = field.multiple ? "array" : "object";
        }

        if (field.type === "image" || field.type === "file") {
          // alt, url, caption from assets....
        }
      }

      items[item.name] = {
        type: item.multiple ? "array" : "object",
        text: item.name,
        content: fields,
      };
    }

    console.log(items);
    return items;
  }
</script>

<Page title="Update Page '{data.page.title}'">
  <ButtonList slot="header-buttons">
    <Button on:click={() => history.back()}>
      <Icon name="chevron-left" />
      Back
    </Button>
    <Button on:click={openPreviewModal} color="primary">Preview</Button>
  </ButtonList>

  <El row>
    <Tabs>
      <Card>
        <CardHeader>
          <TabList>
            <TabItem>General</TabItem>
            <TabItem>Load</TabItem>
            <TabItem>Content</TabItem>
          </TabList>
        </CardHeader>

        <TabContent>
          <CardBody>
            <TabPanel>
              <FormInput bind:value={request.slug} label="Slug" />

              <DynamicFormField
                items={getItems(request.load)}
                type="plain_text"
                bind:value={request.title}
                label="Title"
              />
              <DynamicFormField
                items={getItems(request.load)}
                type="plain_text"
                input_type="textarea"
                label="Description"
                bind:value={request.description}
              />

              <DynamicFormField type="select" items={getItems(request.load)} input_type="radio_group"
                options={[
                  {key: "rtl", 'text': 'Right to left'}, 
                  {key: "ltr", 'text': 'Left to right'}]}
                bind:value={request.dir}
                label="Direction"
               />
            </TabPanel>
            <TabPanel>
              <PageLoad
                items={getItems(request.load)}
                bind:load={request.load}
                bind:tables={data.tables}
              />
            </TabPanel>
            <TabPanel>
              <SlotList
                items={getItems(request.load)}
                on:move={onMove}
                bind:slots={request.slot}
              />
            </TabPanel>
          </CardBody>
          <CardFooter>
            <ButtonList ms="auto">
              <Button on:click={openRemoveConfirmModal} color="danger"
                >Remove</Button
              >
              <Button href="/admin/pages">Cancel</Button>
              <Button on:click={updatePage} color="primary">Save</Button>
            </ButtonList>
          </CardFooter>
        </TabContent>
      </Card>
    </Tabs>
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
