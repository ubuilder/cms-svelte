<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import ListBox from "$lib/components/core/list/ListBox.svelte";
  import ListItem from "$lib/components/core/list/ListItem.svelte";
  import { modal } from "$lib/components/core/modal/modal.js";
  import { Button, Card, CardBody, El, Icon, Status, Switch } from "yesvelte";
  import DynamicDataModal from "./DynamicDataModal.svelte";
  import { invalidateAll } from "$app/navigation";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import SelectFilter from "$lib/components/filters/SelectFilter.svelte";
  import TextFilter from "$lib/components/filters/TextFilter.svelte";
  import DateFilter from "$lib/components/filters/DateFilter.svelte";
  import NumberFilter from "$lib/components/filters/NumberFilter.svelte";
  import RelationItem from "./[id]/RelationItem.svelte";

  export let data;

  async function insertItem() {
    const item = await modal.open(DynamicDataModal, {
      table: data.table,
      data: {},
      title: "Insert " + data.table.name,
      submitText: "Insert",
    });

    if (item) {
      // console.log("item: ", item);
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
  <svelte:fragment slot="title">
    {data.table.name}
    <Button ghost color="secondary" href="./edit">
      <Icon name="settings"/>
    </Button>
  </svelte:fragment>
  <ButtonList slot="header-buttons">
    <Button href="..">
      <Icon name="chevron-left" />
      Back
    </Button>

    <Button href="../{data.table.slug}/insert" color="primary">
      <Icon name="plus" />
      Insert
    </Button>
  </ButtonList>

  <FilterList>
    {#each data.table.fields.filter(x => x.show_in_list !== false) as field}
      {#if field.type === "select"}
        <SelectFilter
          items={field.options ?? []}
          text={field.name}
          key={field.name}
        />
      {:else if field.type === "switch"}
        <SelectFilter
          items={[
            { key: true, text: "True" },
            { key: false, text: "False" },
          ]}
          text={field.name}
          key={field.name}
        />
      {:else if field.type === "date_time"}
        <DateFilter key={field.name} text={field.name} />
      {:else if field.type === "number"}
        <NumberFilter key={field.name} text={field.name} />
      {:else if field.type === "plain_text" || field.type === "rich_text"}
        <TextFilter text={field.name} key={field.name} />
      {/if}
    {/each}
  </FilterList>

  <ListBox title="" items={data.rows.data} let:item>
    {#each data.table.fields.filter(x => x.show_in_list !== false) as field}
      <ListItem name={field.name}>
        {#if field.type === "switch"}
          <Switch disabled checked={item[field.name]} />
        {:else if field.type === "select"}
          <Status color="secondary">{item[field.name]}</Status>
        {:else if field.type === "image"}
          <El tag="img" width="64px" src="/files/{item[field.name]}" />
        {:else if field.type === "relation"}
          {#if field.multiple}
            {#each item[field.name] as x}
              <RelationItem value={x} table={field.table} title={field.title} />
            {/each}
          {:else}
            <RelationItem
              value={item[field.name]}
              table={field.table}
              title={field.title}
            />
          {/if}
        {:else}
          {item[field.name]}
        {/if}
      </ListItem>
    {/each}
    <ListItem style="width: 0" name="Actions">
      <El d="flex" gap="2">
        <Button size="sm" href="../{data.table.slug}/{item.id}">
          <Icon name="eye" />
        </Button>
        <Button
          color="primary"
          size="sm"
          href="../{data.table.slug}/{item.id}/edit"
        >
          <Icon name="pencil" />
        </Button>
        <Button color="danger" size="sm" on:click={() => removeItem(item)}>
          <Icon name="trash" />
        </Button>
      </El>
    </ListItem>
    <El gap="2" d="flex" justifyContent="end" px="3" py="2" slot="end">
      HELLO
    </El>
  </ListBox>
</Page>
