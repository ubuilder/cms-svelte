<script lang="ts">
  import { goto } from "$app/navigation";
  import CodeEditor from "$lib/components/CodeEditor.svelte";
  import ComponentFields from "$lib/components/components/ComponentFields.svelte";
  import {
    Button,
    ButtonList,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormField,
    FormTextarea,
    Page,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
    confirmModal,
  } from "@ulibs/yesvelte";

  export let data

  async function remove() {
    const res = await confirmModal.open({ status: "danger" });

    if (res) {
      // fetch remove
      fetch('?/remove', {method: 'POST'}).then(res => goto('../'))
    }
  }

  function update() {
    // updateComponent....
    fetch('?/update', {method: 'POST', body: JSON.stringify(data.component)}).then(res => goto('../'))

  }
</script>

<Page title="Edit Component '{data.component?.name ?? ''}'">
  <Card>
    <Tabs>
      <CardHeader>
        <TabList>
          <TabItem>Fields</TabItem>
          <TabItem>Template</TabItem>
        </TabList>
      </CardHeader>
      <CardBody>
        <TabContent>
          <TabPanel>
            <!-- after create redirect to edit page in server side -->
            <ComponentFields components={data.components} bind:fields={data.component.fields} />
            
          </TabPanel>
          <TabPanel>
            <FormField label="Template">

            <CodeEditor
              bind:value={data.component.template}
              
            />
          </FormField>

          </TabPanel>
        </TabContent>
      </CardBody>
    </Tabs>

    <CardFooter>
      <ButtonList ms="auto">
        <Button on:click={remove} color="danger">Remove</Button>
        <Button href="/admin/components">Cancel</Button>
        <Button on:click={update} color="primary">Update</Button>
      </ButtonList>
    </CardFooter>
  </Card>
</Page>
