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
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  export let slots: any[] = [];
  export let id = '';


  let element: HTMLDivElement;
  let instance: Sortable;

  async function onEditSlot(slot: any, index: number) {

    console.log('onEditSlot', slot)
    const result = await modal.open(SlotModal, {
      mode: 'edit',
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

  function onMove(obj) {
    console.log(obj)
    
    // 
  }
  
  onMount(() => {
    instance = new Sortable(element, {
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

  });

  onDestroy(() => {
    if(instance) {
      instance.destroy();
    }
  })

  async function onAddSlot() {
    console.log("onAddSlot");
    const slot = await modal.open(SlotModal, {
      mode: 'add',
      slot: {
        props: {},
        slot: []
      },
    });

    if (slot) {
      console.log({ slots, slot });
      slots = [...slots, slot];
    }
  }
</script>

<Accordions {id}>
  <div bind:this={element}>

  {#each slots as slot, index}
    <Card id={id + "_" + index} class="sortable-item" my="2">
      {#if ["Container"].includes(slot.type)}
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
            {#if ["Container"].includes(slot.type)}
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
</div>

</Accordions>

<Button on:click={onAddSlot}>
  <Icon name="plus"/>
   Add Slot
  </Button>
