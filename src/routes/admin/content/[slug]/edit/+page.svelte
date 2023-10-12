<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import PageHeader from "$lib/components/core/PageHeader.svelte";
  import type { Table } from "$lib/types";
  import { Button, El } from "yesvelte";
  import TableEditCard from "../../TableEditCard.svelte";
  import { modal } from "$lib/components/core/modal";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";
  export let data;

  let table: Table = data.table;
  async function editTable() {
    await fetch("../../?/update", {
      method: "POST",
      body: JSON.stringify(table),
    }).then((res) => res.json());

    goto("..", { invalidateAll: true });
  }

  async function removeTable() {
    const choice = await modal.open(ConfirmModal, { status: "danger" });
    if (!choice) return;

    fetch("../../?/remove", {
      method: "POST",
      body: JSON.stringify({ id: table.id }),
    }).then(() => {
      goto("../..", { invalidateAll: true });
    });
  }
</script>

<El container="lg">
  <PageHeader title="Update Table" back />
  <TableEditCard bind:table tables={data.tables}>
    <svelte:fragment slot="footer">
      <Button on:click={() => history.back()}>Cancel</Button>
      <Button color="danger" on:click={() => removeTable()}>Remove</Button>
      <Button
        disabled={!table.name}
        color="primary"
        on:click={() => editTable()}
      >
        Update
      </Button>
    </svelte:fragment>
  </TableEditCard>
</El>
