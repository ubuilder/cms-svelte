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
  } from "yesvelte";
  import SlotModal from "./SlotModal.svelte";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";
  import SlotList from "./SlotList.svelte";
  import { onMount } from "svelte";
  export let data;


  let request: any = data.page


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

  function initSlot(slots, id) {
    const i = new Sortable(document.getElementById(id), {
      animation: 150,
      easing: "cubic-bezier(1, 0, 0, 1)",
      draggable: ".sortable-item",
      group: "nested",
      onEnd: function (/**Event*/ evt) {
        const fromId = evt.from.id;
        const toId = evt.to.id;
        const from = fromId
          .split("-")
          .slice(1)
          .map((x) => +x);
        const to = toId
          .split("-")
          .slice(1)
          .map((x) => +x);

        if (fromId == toId) {
          onMove({
            from,
            to,
            fromIndex: evt.oldIndex,
            toIndex: evt.newIndex,
          });
        } else {
          onMove({
            from,
            to,
            fromIndex: evt.oldIndex,
            toIndex: evt.newIndex,
          });
        }
      },
    });

    console.log(i);

    for (let index in slots) {
      console.log("index: ", index, id);
      console.log(slots[index].type);
      if (slots[index].type === "Container") {
        initSlot(slots[index].slot, id + "-" + index);
      }
    }
  }
  onMount(() => {
   
    initSlot(request.slot, "slot");
  });

  async function addPage() {
    await fetch("?/addPage", {
      body: JSON.stringify(request),
    }).then((res) => res.json());

    invalidateAll();
  }
</script>

<Page title="Add Page">
  <El row>
    <FormInput bind:value={request.title} label="Title" />

    <FormInput bind:value={request.slug} label="Slug" />

    <FormField label="Content">
      <SlotList id="slot" on:move={onMove} bind:slots={request.slot} />
    </FormField>

    <El col my="2">
      <Button on:click={addPage} color="primary">Add</Button>
    </El>
  </El>
</Page>
