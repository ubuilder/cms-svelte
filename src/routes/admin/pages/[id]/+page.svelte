<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Sortable from "sortablejs";
  import Page from "$lib/components/core/Page.svelte";
  import { createEventDispatcher, setContext } from "svelte";
  import { modal } from "$lib/components/core/modal";
  import {
    Button,
    FormField,
    Accordion,
    AccordionBody,
    AccordionHeader,
    El,
    FormInput,    FormCheckbox,

    Accordions,
    Card,
    AccordionTitle,
    Icon,
    FormSelect,
  } from "yesvelte";
  import SlotModal from "$lib/ui/SlotModal.svelte";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";
  import SlotList from "$lib/ui/SlotList.svelte";
  import { onMount } from "svelte";
  import PreviewModal from "./PreviewModal.svelte";
  import { writable } from "svelte/store";

  export let data;
  console.log('data', data)


  let request: any = data.page
  let new_load_name: any = ''

  // const page: any = {
  //   load: {
  //     blog: {
  //       table: "blogs",
  //       where: {
  //         slug: "{{page.slug}}",
  //       },
  //       with: {
  //         author: {
  //           table: "u-users",
  //           field: "author_id",
  //         },
  //       },
  //       // multiple: false
  //     },
  //   },
  //   props: {
  //     title: "{{blog.title}}",
  //     description: "{{blog.description}}",
  //     theme: "tabler",
  //   },
  //   slot: [
  //     {
  //       type: "Container",<
  //       props: { size: "xl" },
  //       slot: [
  //         {
  //           type: "Input",
  //           props: { value: 123 },
  //         },
  //         {
  //           type: "Button",
  //           props: {
  //             color: "red",
  //           },
  //           slot: ["Hello"],
  //         },
  //         {
  //           type: "HtmlText",
  //           props: {
  //             text: "{{{blog.content}}}",
  //           },
  //         },
  //         {
  //           type: "HtmlText",
  //           props: {
  //             text: "by {{{blog.author.name}}}",
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: "Container",
  //       props: { size: "xl" },
  //       slot: [
  //         {
  //           type: "Input",
  //           props: { value: 123 },
  //         },
  //         {
  //           type: "Button",
  //           props: {
  //             color: "red",
  //           },
  //           slot: ["Hello"],
  //         },
  //         {
  //           type: "HtmlText",
  //           props: {
  //             text: "{{{blog.content}}}",
  //           },
  //         },
  //         {
  //           type: "HtmlText",
  //           props: {
  //             text: "by {{{blog.author.name}}}",
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: "HtmlText",
  //       props: {
  //         text: "by {{{blog.author.name}}}",
  //       },
  //     },
  //   ],
  // };

  let items = writable<any>({})


  $: {
    for(let load of request.load) {
      $items[load.name] = load.name
    }
  }

  setContext("items", items)
  function onRemoveLoad(item: any) {
    request.load = request.load.filter(x => x !== item)
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

     
      update()
    }
  }

  function update() {
    fetch('?/updatePage', {
        method: 'POST',
        body: JSON.stringify(request)
      }).then(res => invalidateAll())
    }

//   function initSlot(slots, id) {
    

//     console.log(i);

//     for (let index in slots) {
//       console.log("index: ", index, id);
//       console.log(slots[index].type);
//       if (slots[index].type === "Container") {
//         initSlot(slots[index].slot, id + "-" + index);
//       }
//     }
//   }
//   onMount(() => {
//     initSlot(request.slot, "slot");
//   });
async function openPreviewModal() {
  await modal.open(PreviewModal, {
    slug: request.slug,
    title: request.title
  }, {
    size: 'lg'
  })
}

  function updatePage() {
    fetch("?/updatePage", {
      method: 'POST',
      body: JSON.stringify(request),
    }).then((res) => invalidateAll());
  }
</script>

<Page title="Update Page '{data.page.title}'">
  <Button on:click={openPreviewModal} color="primary" slot="header-buttons">
    Preview
  </Button>
  <El row>
    <FormInput bind:value={request.title} label="Title" />

    <FormInput bind:value={request.slug} label="Slug" />

    <FormField label="Load">
      <Accordions>

        <!-- {
          "name": "blog-item", 
          "table": "blogs", 
          "filters": [
              {"field": "slug", "operator": "=", "value": "home"}
          ],
          "multiple": false
      },
      {
          "name": "users", 
          "table": "users", 
          "filters": [
              {"field": "status", "operator": "=", "value": "active"}
          ],
          "multiple": true
      }             -->
      {#each request.load as load}
        <Card my="2">

        <Accordion style="border: none">
          <AccordionHeader p=0>
            <El w="100" d="flex" alignItems="center" justifyContent="between">
              <AccordionTitle px=3 style="flex: 1">
                {load.name}
              </AccordionTitle>
              <ButtonList on:click>
                <!-- <Button
                  on:click!stopPropagation={() => onEditSlot(slot, index)}
                >
                  <Icon name="pencil" />
                </Button> -->
                <Button border="0" on:click!stopPropagation={() => onRemoveLoad(load)}>
                  <Icon name="trash" />
                </Button>
              </ButtonList>
            </El>
          </AccordionHeader>

          <AccordionBody>
            <FormInput label="Name" bind:value={load.name} />
            <FormSelect label="Table Name" items={data.tables} key="slug" bind:value={load.table} let:item>
              {item.name}
              </FormSelect>
              <FormCheckbox label="Multiple" bind:checked={load.multiple}/>
              <FormField label="Filters">
                {#each load.filters as filter}
                {@const table = data.tables.find(x => x.slug === load.table)}

              <El row>

                <FormSelect col="3" label="Field" items={table.fields} key="name" bind:value={filter.field} let:item>
                  <Icon name="user"/>

                  {item.name}
                  </FormSelect>
                <FormSelect col="2" label="Operator" items={['=', '!=', 'like']} bind:value={filter.operator} let:item>
                  {item}
                  </FormSelect>
                  <FormInput col label="Value" bind:value={filter.value} />                  
                  <Button color="danger" ghost px="2" mb="3" mt="4" col="auto" on:click={() => load.filters = load.filters.filter(x => x !== filter)}><Icon name="trash"/></Button>
                </El>

             {/each}

            <Button color="primary" on:click={() => load.filters = [...load.filters, {}]}>                      <Icon name="plus" /> 
              Add New Filter
            </Button>
          </FormField>

          </AccordionBody>

              </Accordion>
              </Card>
      {/each}
    </Accordions>

      <FormInput bind:value={new_load_name} label="New Load Name"/>
      <Button on:click={() => request.load = [...request.load, {table: '', name: new_load_name, filters:[]}]}>+ Load Table</Button>
    </FormField>

    <FormField label="Content">
      <SlotList id="slot" on:move={onMove} bind:slots={request.slot} />
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