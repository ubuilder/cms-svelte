<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
  import Modal from "$lib/components/core/modal/Modal.svelte";
  import { tick } from "svelte";
  import {
    FormInput,
    Button,
    FormSelect,
    ModalBody,
    ModalFooter,
    Tabs,
    TabItem,
    TabList,
    TabContent,
    TabPanel,
  } from "yesvelte";

  let items = [
    {
      hasSlot: false,
      name: "Button",
      props: [
        { name: "text", type: "string" },
        { name: "color", type: "string" },
      ],
    },
    {
      name: "Container",
      hasSlot: true,
      props: [{ name: "size", type: "string" }],
    },
    {
      name: "Input",
      hasSlot: false,
      props: [{ name: "value", type: "string" }],
    },
    {
      name: "HtmlText",
      hasSlot: false,
      props: [{ name: "content", type: "string" }],
    },
  ];

  let slot: any = {
    props: {},
    slot: [],
  };

  $: item = items.find((x) => x.name === slot.type);
</script>

<Modal>
  <ModalBody>
    <FormSelect {items} label="Type" key="name" bind:value={slot.type} let:item>
      {item.name}
    </FormSelect>

    {#if item}
      {#each item.props as prop}
        <FormInput label={prop.name} bind:value={slot.props[prop.name]} />
      {/each}
    {/if}
  </ModalBody>

  <ModalFooter>
    <ButtonList>
      <Button on:click={() => $modal.close()}>Cancel</Button>
      <Button on:click={() => $modal.resolve(JSON.parse(JSON.stringify(slot)))} color="primary">Add</Button>
    </ButtonList>
  </ModalFooter>
</Modal>
