<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import type { Table } from "$lib/types";
    import {PageHeader, Button, El } from "@ulibs/yesvelte";
      import { t } from "$lib/i18n"
	import TableEditCard from "./TableEditCard.svelte"
	import { api } from "$lib/helpers/api"
	import { onMount } from "svelte"
  
    export let tables = [];

    onMount(async ()=>{
        tables  = await api('/tables',{})
    })
    let table: Partial<Table> = {
      icon: "database",
      fields: [],
    };

  
    async function createTable() {

      if (table) {

        await api("/tables", {data: table})

        ///
    //     await fetch("../?/create", {
    //       method: "POST",
    //       body: JSON.stringify(table),
    //     }).then((res) => res.json());
    //       goto('..', {invalidateAll: true})
      }
    }
</script>

<El container="lg">
	<PageHeader title={t('content.create_table')} back />
	<TableEditCard bind:table tables={tables}>
		<svelte:fragment slot="footer">
			<Button on:click={() => history.back()}>{t('buttons.cancel')}</Button>
			<!-- <Button color="danger" on:click={() => removeTable()}>Remove</Button> -->
			<Button disabled={!table.name} color="primary" on:click={() => createTable()}>
				{t('buttons.create')}
			</Button>
		</svelte:fragment>
	</TableEditCard>
</El>
