<script>
    import {Button, ButtonList, Page, FilterList, TextFilter, El, Card, Icon, modal} from '@ulibs/yesvelte'
  import AddComponentModal from '../../../lib/components/components/AddComponentModal.svelte';
  import { invalidateAll } from '$app/navigation';
  import { t } from '$lib/i18n';
    export let data;

    async function addComponent() {
        const component = await modal.open(AddComponentModal, {
            data: {}
        })

        if(component) {
            console.log('should add component')

            fetch('?/createComponent', {
                method: 'POST',
                body: JSON.stringify(component)
            }).then(res => res.json()).then(res => {
                // console.log({res})
                invalidateAll()
            })
        }
        // open modal and get name of component
        // redirect to edit page

    }
</script>
<Page title={t("components.title")}>
    <ButtonList slot="header-buttons">
        <Button color="primary" on:click={addComponent}>
            <Icon name="plus"/>
            {t("components.add_component")}</Button>

    </ButtonList>

    <FilterList>
        <TextFilter key="name" text={t("components.filters.name")}/>
    </FilterList>

    <El row>
        {#each data.components as component}
            <El mb="2" col colMd="4" colLg="3">
                <Card tag="a" href="./{component.id}" p="3">
                    {component.name}
                </Card>
            </El>
        {/each}
    </El>
</Page>