<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import { modal } from "$lib/components/core/modal";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import { Button, Card, CardBody, El, Icon } from "yesvelte";
  import ActionEditModal from "./ActionEditModal.svelte";
  import { invalidateAll } from "$app/navigation";
  import TextFilter from "$lib/components/filters/TextFilter.svelte";

  export let data;

  async function createAction() {
    const data = await modal.open(ActionEditModal, {
      action: {
        name: "",
        fields: [],
      },
      submitText: 'Create'
    });

    if (data) {
      await fetch("?/create", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }

  async function editAction(action: any) {
    const data = await modal.open(ActionEditModal, {
      action,
      title: "Edit Action",
      submitText: "Update",
    });

    if (data) {
      await fetch("?/update", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }

</script>

<Page title="Action">
  <Button on:click={() => createAction()} slot="header-buttons" color="primary">
    <Icon name="plus" /> Create Action
  </Button>

  <FilterList>
    <TextFilter key="name" text="Name" />
  </FilterList>

  <El row>
    {#each data?.actions as action}
      <El mb="2" col="12" colMd="6" colLg="4" colXl="3">
        <El tag="a" href="/admin/actions/{action.slug}">
          <Card>
            <CardBody d="flex" alignItems="center" justifyContent="between">
              <El d="flex" gap="3" alignItems="center">
                {action.name}
              </El>
              <Icon
                on:click!stopPropagation!preventDefault={() => editAction(action)}
                size="lg"
                name="settings"
              />
            </CardBody>
          </Card>
        </El>
      </El>
    {/each}
  </El>

</Page>
