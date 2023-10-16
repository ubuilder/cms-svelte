<script lang="ts">
  import Sortable from "sortablejs";
  import {
    ButtonList,
    modal,
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionTitle,
    Accordions,
    Button,
    Card,
    confirmModal,
    El,
    Icon,
  } from "@ulibs/yesvelte";
  import SlotModal from "./SlotModal.svelte";
  import { onDestroy, onMount } from "svelte";
  import { components } from ".";
  import { slots as slotsStore } from "$lib/stores/pageSlots";
  import Element from "./Element.svelte";

  export let slotList: any[] = [];
  export let id = "";
  export let items: any = {};

  let element: HTMLDivElement;
  let instance: Sortable;

  async function onRemoveSlot(index: number) {
    const choice = await confirmModal.open({
      status: "danger",
    });

    if (choice) {
      slotList.splice(index, 1);
      slotList = slotList;
    }
  }
  type MoveCustomeEvent = {
    from: string;
    to: string;
    fromIndex: number;
    toIndex: number;
  };
  function onMove(obj: MoveCustomeEvent): void {
    let fromAdd = obj.from?.split("_") ?? [];
    let toAdd = obj.to?.split("_") ?? [];
    let from = $slotsStore;
    let to = $slotsStore;
    for (let i of fromAdd) {
      if (i !== "") {
        from = from[i].slot;
      }
    }
    for (let i of toAdd) {
      if (i !== "") {
        to = to[i].slot;
      }
    }
    const temp = JSON.stringify(from[obj.fromIndex]) as string;
    from.splice(obj.fromIndex, 1);
    to.splice(obj.toIndex, 0, JSON.parse(temp));
    $slotsStore = $slotsStore;
  }

  onMount(() => {
    instance = new Sortable(element, {
      animation: 150,
      easing: "cubic-bezier(1, 0, 0, 1)",
      draggable: ".sortable-item",
      group: "nested",
      onEnd: function (/**Event*/ evt) {
        console.log(evt);
        onMove({
          from: evt.from?.parentElement?.id,
          to: evt.to?.parentElement?.id,
          fromIndex: evt.oldIndex,
          toIndex: evt.newIndex,
        });
      },
    });
  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
    }
  });

  async function onAddSlot() {
    console.log("onAddSlot");
    const slot = await modal.open(SlotModal, {
      mode: "add",
      slot: {
        props: {},
        slot: [],
      },
    });

    if (slot) {
      slotList = [...(slotList ?? []), slot];
    }
  }
</script>

<Accordions id={id + "_"}>
  <div style="padding: 8px 0px" bind:this={element}>
    {#each slotList ?? [] as slot, index}
      <Card
        style="border: none;"
        id={id + "_" + index}
        class="page-slot sortable-item"
        my="2"
      >
        <Accordion>
          <AccordionHeader p="0">
            <El w="100" d="flex" alignItems="center" justifyContent="between">
              <AccordionTitle px="3" style="flex: 1; color: #aaa">
                {slot.type}
              </AccordionTitle>
              <ButtonList on:click>
                <!-- <Button
                  on:click!stopPropagation={() => onEditSlot(slot, index)}
                >
                  <Icon name="pencil" />
                </Button> -->
                <Button
                  ghost
                  color="danger"
                  on:click!stopPropagation={() => onRemoveSlot(index)}
                >
                  <Icon name="trash" />
                </Button>
              </ButtonList>
            </El>
          </AccordionHeader>
          <AccordionBody p="0">
            <Element bind:element={slot} {items} {components} mode="edit" />
          </AccordionBody>
        </Accordion>
      </Card>
    {/each}
  </div>
</Accordions>

<Button color="primary" on:click={onAddSlot}>
  <Icon name="plus" />
  Add Slot
</Button>

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
