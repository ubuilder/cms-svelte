

<script lang="ts">
 import { Button, FormInput, ModalBody, TabContent, TabItem, TabList, TabPanel, Tabs } from "yesvelte";



 export let props: any = {};

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
      <FormInput label="Text" bind:value={props.text} />
    </TabPanel>
    <TabPanel p="3">
      <FormInput label="Color" bind:value={props.color} />
    </TabPanel>
    <TabPanel p="3">
      <FormInput label="type" bind:value={props.type} />
    </TabPanel>
  </TabContent>
</Tabs>

{:else}
  <Button type={props.type} color={props.color} {...$$restProps}>
    {props.text}
  </Button>
{/if}
