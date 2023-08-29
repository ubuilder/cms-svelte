<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import ListBox from "$lib/components/core/list/ListBox.svelte";
  import ListItem from "$lib/components/core/list/ListItem.svelte";
  import { modal } from "$lib/components/core/modal/modal.js";
  import { Button, El, Icon } from "yesvelte";
  import DynamicDataModal from "./DynamicDataModal.svelte";
  import { invalidateAll } from "$app/navigation";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";

  export let data;

  async function insertItem() {
    const item = await modal.open(DynamicDataModal, {
      table: data.table,
      data: {},
      title: "Insert " + data.table.name,
      submitText: "Insert",
    });

    if (item) {
      console.log("item: ", item);
      await fetch("?/insert", {
        method: "POST",
        body: JSON.stringify(item),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }

  async function updateItem(row: any) {
    const item = await modal.open(DynamicDataModal, {
      table: data.table,
      data: row,
      title: "Update Data",
      submitText: "Update",
    });

    if (item) {
      await fetch("?/update", {
        method: "POST",
        body: JSON.stringify(item),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }

  async function previewItem(item: any) {
    //
  }
  async function removeItem(item: any) {
    const choice = await modal.open(ConfirmModal, {
      status: "danger",
      title: "Are you sure to remove this Row?",
    });

    if (choice) {
      await fetch("?/remove", {
        method: "POST",
        body: JSON.stringify({ id: item.id }),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }
</script>

<Page title={data.table.name}>
  <ButtonList slot="header-buttons">
    <Button href="/admin/data">
      <Icon name="chevron-left" />
      Back
    </Button>

    <Button on:click={() => insertItem()} color="primary">
      <Icon name="plus" />
      Insert
    </Button>
  </ButtonList>

  <ListBox title="" items={data.rows.data} let:item>
    {#each data.table.fields as field}
      <ListItem name={field.name}>
        {item[field.name]}
      </ListItem>
    {/each}
    <ListItem style="width: 0" name="Actions">
      <El d="flex" gap="2">
        <Button size="sm" on:click={() => previewItem(item)}>
          <Icon name="eye" />
        </Button>
        <Button color="primary" size="sm" on:click={() => updateItem(item)}>
          <Icon name="pencil" />
        </Button>
        <Button color="danger" size="sm" on:click={() => removeItem(item)}>
          <Icon name="trash" />
        </Button>
      </El>
    </ListItem>
  </ListBox>
</Page>
