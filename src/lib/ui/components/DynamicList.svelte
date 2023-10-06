<script lang="ts">
  import { page } from "$app/stores";
  import { getContext } from "svelte";
  import {
    Button,
    El,
    FormInput,
    FormSelect,
    ModalBody,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
  } from "yesvelte";
  import SlotList from "../SlotList.svelte";
  import { components } from "$lib/ui";
  import Element from "../Element.svelte";
  import DynamicFormField from "$lib/components/data/DynamicFormField.svelte";

  export let items: any = {};
  export let props: any = {};

  // function updateStore(data: any) {
  //   $items[data] = 'test'
  // }
  function getItemsArray(items: any, array: any[] = [], key = "") {
    let list: any[] = [];

    Object.keys(items).map((item) => {
      list.push({
        text: items[item].text,
        key: key ? key + "." + item : item,
        type: items[item].type,
      });
      if (items[item].type === "object" && items[item].content) {
        list = getItemsArray(items[item].content, list, item);
        console.log(list);
      }
    });

    console.log({ array, list });
    return [...array, ...list];
  }

  // TODO: use recursive function
  function getItemsContent(items: any, key: string) {
    items[props.name] = getItems(items, props.itemName)[props.itemName];

    if (key.includes(".")) {
      console.log(items, key);
      const [a, b] = key.split(".");
      return getItems(items, props.name)[a][b];
    }
    return getItems(items, props.name)[key];
  }

  function getItems(items: any, key: string) {
    if (!items[key]) return items;

    console.log("items: ", items, key);

    return {
      ...items,
      [props.name]: {
        type: "object",
        text: props.name,
        content: items[key].content,
      },
    };
  }

  export let edit = false;
</script>

{#if edit}
  <El p="3">
    <El row>
      <FormSelect
        col="6"
        label="items"
        bind:value={props.itemName}
        items={getItemsArray(items).filter((item) => item.type === "array")}
        key="key"
        let:item
      >
        {item.text}
      </FormSelect>
      <FormInput col="6" label="Name" bind:value={props.name} />

      <DynamicFormField
        type="select"
        {items}
        col="6"
        label="Column Size (1-12)"
        bind:value={props.size}
        options={[
          "auto",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          true,
        ]}
      />
    </El>

    <SlotList bind:slots={props.slot} items={getItems(items, props.itemName)} />
  </El>
{:else}
  <!-- <pre>

  {JSON.stringify(items, null, 2)}
</pre> -->

  <El row>
    {#each items[props.itemName]??[] as item}
      <!-- <pre>

        {JSON.stringify(props, null, 2)}
      </pre> -->

      <El col={props.size}>

        
        {#each props.slot as slot}
          <Element
            element={{ ...slot, slot: slot.props.slot }}
            items={{ ...items, [props.name]: item }}
            {components}
          />
        {/each}
      </El>
    {/each}
  </El>

  <!-- {#each getItemsArray(items) as item}
    
  {JSON.stringify(items)}
    {#each props.slot as slot}
      <Element element={{ ...slot, slot: slot.props.slot }} items={{...items, [props.name]: item}} {components} />
    {/each}
  {/each} -->
  <!-- {#each getItemsContent(items, props.itemName) as item}
    {JSON.stringify(item)}
    {#each props.slot as slot}
      {@const items2 = getItems(items, item)}
      {JSON.stringify(items2)}
      <Element element={{ ...slot, slot: slot.props.slot }} items={items2} {components} />
    {/each}
  {/each} -->
{/if}
