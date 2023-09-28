<script lang="ts">
  import { page } from "$app/stores";
    import { Button, FormInput, FormSelect, ModalBody, TabContent, TabItem, TabList, TabPanel, Tabs } from "yesvelte";
      
    const tables = $page.data.tables
    export let props: any = {};
   
    export let edit = false;
   </script>
   
   {#if edit}
   <Tabs>
     <TabList>
       <TabItem>General</TabItem>
       <TabItem>Filters</TabItem>
       <TabItem>Pagination</TabItem>
     </TabList>
     <TabContent>
       <TabPanel p="3">

        <FormSelect
        label="Table"
        key="slug"
        bind:value={props.table}
        items={tables}
        let:item
      >
        {item.name}
      </FormSelect>
    <FormInput label="Name" bind:value={props.name} />
      

    </TabPanel>
       <TabPanel p="3">
        TODO
         <!-- <FormInput label="Fil" bind:value={props.color} /> -->
       </TabPanel>
       <TabPanel p="3">
        <FormInput label="page" bind:value={props.page} />
        <FormInput label="perPage" bind:value={props.perPage} />
       </TabPanel>
     </TabContent>
   </Tabs>
   
   {:else}
      <slot/>
   {/if}
   