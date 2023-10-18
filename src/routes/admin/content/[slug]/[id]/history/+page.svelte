<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import type { DbTable } from "$lib/types/index.js";
  import {
    Button,
    El,
    Page,
    PageHeader,
    ListBox,
    ListItem,
    Status,
    Switch,
  } from "@ulibs/yesvelte";
  import RelationItem from "../RelationItem.svelte";

  export let data;

  function onRollback(item: DbTable) {
    fetch("?/rollback", {
      method: "POST",
      body: JSON.stringify(item),
    }).then((res) => {
      goto("..", { invalidateAll: true });
    });
  }
</script>

<El container="lg">
  <PageHeader title="History" back />

  <ListBox mt="3" title="" items={data.rows.data} let:item>
    {#each data.table.fields.filter((x) => x.show_in_list !== false) as field}
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
      <Button
        size="sm"
        outline
        color="primary"
        on:click={() => onRollback(item)}>Rollback</Button
      >
    </ListItem>
  </ListBox>
</El>
