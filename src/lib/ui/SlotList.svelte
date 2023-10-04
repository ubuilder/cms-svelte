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
  import { components } from ".";

  export let slots: any[] = [];
  export let id = '';
  export let items: any = {}


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
      slots = [...(slots ??[]), slot];
    }
  }
</script>

<Accordions {id}>
  <div style="padding: 8px 0px" bind:this={element}>

  {#each slots ?? [] as slot, index}
    <Card style="border: none;" id={id + "_" + index} class="sortable-item" my="2">
        <Accordion>
          <AccordionHeader p=0>
            <El w="100" d="flex" alignItems="center" justifyContent="between">
              <AccordionTitle px=3 style="flex: 1">
                {slot.type}
              </AccordionTitle>
              <ButtonList on:click>
                <!-- <Button
                  on:click!stopPropagation={() => onEditSlot(slot, index)}
                >
                  <Icon name="pencil" />
                </Button> -->
                <Button border="0" on:click!stopPropagation={() => onRemoveSlot(index)}>
                  <Icon name="trash" />
                </Button>
              </ButtonList>
            </El>
          </AccordionHeader>
          <AccordionBody p=0>
            <svelte:component this={components[slot.type]} edit bind:slots={slot.slot} {items} bind:props={slot.props} />

            <!-- {#if ["Container"].includes(slot.type)}
            <svelte:self
                on:move
                id={id + "-" + index}
                bind:slots={slot.slot}
              />
            {/if} -->
          </AccordionBody>
        </Accordion>
      <!-- {:else}
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
      {/if} -->
    </Card>
  {/each}
</div>

</Accordions>

<Button on:click={onAddSlot}>
  <Icon name="plus"/>
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