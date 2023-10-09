<script lang="ts">
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";


  import { Button, Card, CardBody, CardHeader, TabContent, TabItem, TabList, TabPanel, Tabs } from "yesvelte";

  export let items: any = {}
  export let props: any = {}

</script>
<Card>
  
<Tabs>
  <CardHeader>

    <TabList>
      <TabItem>General</TabItem>
      <TabItem>Style</TabItem>
      <TabItem>Advanced</TabItem>
      <TabItem>Events</TabItem>
    </TabList>
  </CardHeader>

    <TabContent>
      <CardBody>

      <TabPanel>
        <DynamicFormField {items} type="plain_text" label="Text" bind:value={props.text} />
      </TabPanel>
      <TabPanel>
        <DynamicFormField {items} type="plain_text" label="Color" bind:value={props.color} />
      </TabPanel>
      <TabPanel>
        <DynamicFormField {items} type="plain_text" label="type" bind:value={props.type} />
      </TabPanel>
      <TabPanel>
        {#each props.events ?? [] as event}
          <DynamicFormField {items} options={["submit", "click", "change", '...']} type="select" label="type" bind:value={event.type} />
          <DynamicFormField {items} options={["create", "remove", "update", '...']} type="select" label="action" bind:value={event.action} />  
        {/each}
        <Button on:click={()=> props.events = [...(props.events??[]), {}] }>Add Event</Button>
      </TabPanel>
      
    </CardBody>

    </TabContent>
  </Tabs>
</Card>
  