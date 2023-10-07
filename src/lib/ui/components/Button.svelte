<script lang="ts">
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";
 import { Button, FormInput, ModalBody, TabContent, TabItem, TabList, TabPanel, Tabs } from "yesvelte";

 export let props: any = {};

 export let items: any = {};
 
 export let edit = false;
</script>

{#if edit}
<Tabs>
  <TabList>
    <TabItem>General</TabItem>
    <TabItem>Style</TabItem>
    <TabItem>Advanced</TabItem>
  </TabList>
  <TabContent>
    <TabPanel p="3">
      <DynamicFormField {items} type="plain_text" label="Text" bind:value={props.text} />
    </TabPanel>
    <TabPanel p="3">
      <DynamicFormField {items} type="plain_text" label="Color" bind:value={props.color} />
    </TabPanel>
    <TabPanel p="3">
      <DynamicFormField {items} type="plain_text" label="type" bind:value={props.type} />
    </TabPanel>
  </TabContent>
</Tabs>

{:else}
  <Button type={props.type} color={props.color} {...$$restProps}>
    {props.text}
  </Button>
{/if}
