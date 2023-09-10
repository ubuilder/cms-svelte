<script lang="ts">
  import Sortable from "sortablejs";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";

  import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionTitle,
    Accordions,
    Button,
    Card,
    El,
    Icon,
  } from "yesvelte";
  import SlotModal from "./SlotModal.svelte";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";
  import { createEventDispatcher, onMount } from "svelte";

  export let slots: any[] = [];
  export let id = '';


  async function onEditSlot(slot: any, index: number) {
    const result = await modal.open(SlotModal, {
      slot: JSON.parse(JSON.stringify(slot)),
    });

    if (result) {
      console.log({ slots, index });
      slots[index] = result;
    }
  }

  async function onRemoveSlot(index: number) {
    const choice = await modal.open(ConfirmModal, {
      status: "danger",
    });

    if (choice) {
      slots.splice(index, 1);
      slots = slots;
    }
  }
//   onMount(() => {      
    //     console.log('itemEl',evt.item);  // dragged HTMLElement
    //     console.log('to', evt.to);    // target list
    //     console.log('from', evt.from);  // previous list
    //     console.log('oldIndex', evt.oldIndex);  // element's old index within old parent
    //     console.log('newIndex', evt.newIndex);  // element's new index within new parent
    //     console.log('oldDraggableIndex', evt.oldDraggableIndex); // element's old index within old parent, only counting draggable elements
    //     console.log('newDraggableIndex', evt.newDraggableIndex); // element's new index within new parent, only counting draggable elements
    //     console.log('clone', evt.clone) // the clone element
    //     console.log('pullMode', evt.pullMode);  // when item is in another sortable: `"clone"` if cloning, `true` if moving
    //   }
    //   });
    //   console.log(i)
//   });

  async function onAddSlot() {
    console.log("onAddSlot");
    const slot = await modal.open(SlotModal, {
      slot: {},
    });

    if (slot) {
      console.log({ slots, slot });
      slots = [...slots, slot];
    }
  }
</script>

<Accordions {id}>
  {#each slots as slot, index}
    <Card id={id + "_" + index} class="sortable-item" my="2">
      {#if slot.type === "Container"}
        <Accordion>
          <AccordionHeader>
            <El w="100" d="flex" alignItems="center" justifyContent="between">
              <AccordionTitle style="flex: 1">
                {slot.type}
              </AccordionTitle>
              <ButtonList on:click me="2">
                <Button
                  on:click!stopPropagation={() => onEditSlot(slot, index)}
                >
                  <Icon name="pencil" />
                </Button>
                <Button on:click!stopPropagation={() => onRemoveSlot(index)}>
                  <Icon name="trash" />
                </Button>
              </ButtonList>
            </El>
          </AccordionHeader>
          <AccordionBody>
            {#if slot.type === "Container"}
              <svelte:self
                on:move
                id={id + "-" + index}
                bind:slots={slot.slot}
              />
            {/if}
          </AccordionBody>
        </Accordion>
      {:else}
        <El p="3" d="flex">
          <El w="100" d="flex" alignItems="center" justifyContent="between">
            <AccordionTitle style="flex: 1">{slot.type}</AccordionTitle>
            <ButtonList on:click!stopPropagation!preventDefault me="2">
              <Button on:click={() => onEditSlot(slot, index)}>
                <Icon name="pencil" />
              </Button>
              <Button on:click={() => onRemoveSlot(index)}>
                <Icon name="trash" />
              </Button>
            </ButtonList>
          </El>
        </El>
      {/if}
    </Card>
  {/each}
</Accordions>
<Button on:click={onAddSlot}>+ Add Slot</Button>
