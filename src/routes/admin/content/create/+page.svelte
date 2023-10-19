<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import type { Table } from "$lib/types";
  import {PageHeader, Button, El } from "@ulibs/yesvelte";
  import TableEditCard from "../TableEditCard.svelte";

  export let data;
  let table: Partial<Table> = {
    icon: "database",
    fields: [],
  };

  async function createTable() {
    if (table) {
      await fetch("../?/create", {
        method: "POST",
        body: JSON.stringify(table),
      }).then((res) => res.json());
        goto('..', {invalidateAll: true})
    }
  }
</script>

<El container="lg">
  <PageHeader title="Create Table" back />
  <TableEditCard bind:table tables={data.tables}>
    <svelte:fragment slot="footer">
      <Button on:click={() => history.back()}>Cancel</Button>
      <!-- <Button color="danger" on:click={() => removeTable()}>Remove</Button> -->
      <Button
        disabled={!table.name}
        color="primary"
        on:click={() => createTable()}
      >
        Create
      </Button>
    </svelte:fragment>
  </TableEditCard>
</El>
