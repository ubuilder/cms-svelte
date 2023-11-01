<script lang="ts">
  import { goto } from "$app/navigation";
  import CodeEditor from "$lib/components/CodeEditor.svelte";
  import ComponentFields from "$lib/components/components/ComponentFields.svelte";
  import { t } from "$lib/i18n/index.js";
	import SlotList from "$lib/ui/SlotList.svelte"
  import {
    Button,
    ButtonList,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormField,
    FormInput,
    FormSwitch,
    FormTextarea,
    Page,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
    Textarea,
    confirmModal,
  } from "@ulibs/yesvelte";
	import { createEventDispatcher } from "svelte"

  export let component: any = {}
  export let components:any[] = []


  async function remove() {
    const res = await confirmModal.open({ status: "danger" });

    if (res) {
      // fetch remove
   dispatch('remove') }
  }

  function getItems(fields: any[]) {
    const res : any = {}

    for(let field of fields) {
      res[field.name] = {
        type: field.type,
        text: field.name
      }
    }


    return res
  }

  const dispatch = createEventDispatcher()
  function update() {
    // updateComponent....
    dispatch('update', component)
    
  }

  let title = t('components.edit_component') + ` "${component?.name ?? ''}"`
</script>

<Page>
  <ButtonList slot="header-buttons" ms="auto">
    <Button on:click={remove} color="danger">{t('buttons.remove')}</Button>
    <Button disabled href="../">{t('buttons.cancel')}</Button>
    <Button on:click={update} color="primary">{t('buttons.update')}</Button>
  </ButtonList>
  <Card>
    <Tabs>
      <CardHeader>
        <TabList>
          <TabItem>{t('components.forms.general')}</TabItem>
          <TabItem>{t('components.forms.content')}</TabItem>
        </TabList>
      </CardHeader>
      <CardBody>
        <TabContent>
          <TabPanel>
            <FormInput bind:value={component.name} label={t('components.forms.name')}/>
            <FormSwitch  bind:checked={component.hidden} description="Useful when you want to use it only as child component.">
              Hide from components list
              </FormSwitch>

            <!-- after create redirect to edit page in server side -->
            <ComponentFields {components} bind:fields={component.fields} />
            
          </TabPanel>
          <TabPanel>
            <FormSwitch  bind:checked={component.raw}>
              Write raw HTML
              </FormSwitch>
              {#if component.raw}
            <FormField label={t('components.forms.template')}>
            <Textarea dir="ltr" style="font-family: monospace;" rows="12"
              bind:value={component.template}
            />
        
          </FormField>
          {:else}
          <FormField label={t('components.forms.content')}>
            
            TODO::::
          <!-- <SlotList
								components={components}
								items={getItems(component.fields)}
								bind:slotList={component.slot} />
                 -->
            </FormField>

          {/if}

          </TabPanel>
        </TabContent>
      </CardBody>
    </Tabs>
  </Card>
</Page>
