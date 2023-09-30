<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Sortable from "sortablejs";
  import Page from "$lib/components/core/Page.svelte";
  import { createEventDispatcher } from "svelte";
  import { modal } from "$lib/components/core/modal";
  import {
    Button,
    FormField,
    Accordion,
    AccordionBody,
    AccordionHeader,
    El,
    FormInput,
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
  import FormFields from "$lib/components/data/FormFields.svelte";
  export let data;


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

  function updatePage() {
    fetch("?/updatePage", {
      method: 'POST',
      body: JSON.stringify(request),
    }).then((res) => invalidateAll());
  }
</script>

<Page title="Update Page '{data.page.title}'">
  <El row>
    <FormInput bind:value={request.title} label="Title" />

    <FormInput bind:value={request.slug} label="Slug" />

    <FormField label="Load">
      <Accordions>

      {#each Object.keys(request.load) as key}
        <Accordion>
          <AccordionHeader>
            {key}
              <Button on:click={()=> delete request.load[key]}>
                <Icon name="trash"/>
              </Button>
          </AccordionHeader>
          <AccordionBody>
            <FormSelect label="Table Name" items={data.tables} key="slug" bind:value={request.load[key].table} let:item>
              {item.name}
              </FormSelect>
            <FormField label="Filters">
              Todo
            </FormField>
          </AccordionBody>
        </Accordion>
      {/each}
    </Accordions>

      <FormInput bind:value={new_load_name} label="New Load Name"/>
      <Button on:click={() => request.load[new_load_name] = {table: ''}}>+ Load Table</Button>
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
