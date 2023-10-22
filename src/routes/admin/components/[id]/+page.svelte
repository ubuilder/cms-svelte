<script lang="ts">
  import { goto } from "$app/navigation";
  import CodeEditor from "$lib/components/CodeEditor.svelte";
  import ComponentFields from "$lib/components/components/ComponentFields.svelte";
  import { t } from "$lib/i18n/index.js";
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

  export let data

  async function remove() {
    const res = await confirmModal.open({ status: "danger" });

    if (res) {
      // fetch remove
      fetch('?/remove', {method: 'POST', body: '{}'}).then(res => goto('../', {invalidateAll: true}))
    }
  }

  function update() {
    // updateComponent....
    fetch('?/update', {method: 'POST', body: JSON.stringify(data.component)}).then(res => goto('../', {invalidateAll: true}))

  }

  let title = t('components.edit_component') + ` "${data.component?.name ?? ''}"`
</script>

<Page {title}>
  <Card>
    <Tabs>
      <CardHeader>
        <TabList>
          <TabItem>{t('components.forms.general')}</TabItem>
          <TabItem>{t('components.forms.template')}</TabItem>
        </TabList>
      </CardHeader>
      <CardBody>
        <TabContent>
          <TabPanel>
            <FormInput bind:value={data.component.name} label={t('components.forms.name')}/>
            <FormSwitch  bind:checked={data.component.hidden} description="Useful when you want to use it only as child component.">
              Hide from components list
              </FormSwitch>

            <!-- after create redirect to edit page in server side -->
            <ComponentFields components={data.components} bind:fields={data.component.fields} />
            
          </TabPanel>
          <TabPanel>
            <FormField label={t('components.forms.template')}>
            <Textarea dir="ltr" style="font-family: monospace;" rows="12"
              bind:value={data.component.template}
            />
          </FormField>

          </TabPanel>
        </TabContent>
      </CardBody>
    </Tabs>

    <CardFooter>
      <ButtonList ms="auto">
        <Button on:click={remove} color="danger">{t('buttons.remove')}</Button>
        <Button href="/admin/components/">{t('buttons.cancel')}</Button>
        <Button on:click={update} color="primary">{t('buttons.update')}</Button>
      </ButtonList>
    </CardFooter>
  </Card>
</Page>
