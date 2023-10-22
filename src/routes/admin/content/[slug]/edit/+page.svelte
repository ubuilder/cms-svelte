<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";

  import type { Table } from "$lib/types";
  import { Button, El,PageHeader, modal, confirmModal } from "@ulibs/yesvelte";
  import TableEditCard from "../../TableEditCard.svelte";
	import { t } from "$lib/i18n"

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
    const choice = await confirmModal.open({ status: "danger" });
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
      <Button on:click={() => history.back()}>{t("buttons.cancel")}</Button>
      <Button color="danger" on:click={() => removeTable()}>{t("buttons.remove")}</Button>
      <Button
        disabled={!table.name}
        color="primary"
        on:click={() => editTable()}
      >
      {t("buttons.update")}
      </Button>
    </svelte:fragment>
  </TableEditCard>
</El>
