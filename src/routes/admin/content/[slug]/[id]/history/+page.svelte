<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import type { DbTable } from '$lib/types/index.js'
	import { Button, El, Page, PageHeader, ListBox, ListItem, Status, Switch } from '@ulibs/yesvelte'
	import RelationItem from '../RelationItem.svelte'

	export let data

	function onRollback(history_id: string) {
		fetch('?/rollback', {
			method: 'POST',
			body: JSON.stringify(history_id),
		}).then((res) => {
			goto('..', { invalidateAll: true })
		})
	}
</script>

<El container="lg">
	<PageHeader title="History" back />
	<ListBox mt="3" title="" items={data.rows.data.data} let:item>
		{#each data.table.fields.filter((x) => x.show_in_list !== false) as field}
			<ListItem name={field.name}>
				{#if item.type === 'update' || item.type === 'insert'}
					{#if field.type === 'switch'}
						<Switch disabled checked={item.data[field.name]} />
					{:else if field.type === 'select'}
						<Status color="light">{item.data[field.name]}</Status>
					{:else if field.type === 'image'}
						<El tag="img" width="64px" src="/files/{item.data[field.name]}" />
					{:else if field.type === 'relation'}
						{#if field.multiple}
							{#each item.data[field.name] as x}
								<RelationItem value={x} table={field.table} title={field.title} />
							{/each}
						{:else}
							<RelationItem value={item.data[field.name]} table={field.table} title={field.title} />
						{/if}
					{:else}
						{item.data[field.name]}
					{/if}
				{:else if item.type === 'remove'}
          <El textColor="success">---</El>
				{:else if item.type === 'recover'}
          <El textColor="success">---</El>
				{/if}
			</ListItem>
		{/each}
		<ListItem name="Date" style="white-space: nowrap;">
			{new Date(item.data.created_at).toDateString()}
		</ListItem>
		<ListItem name="User">
			{item.data.created_by}
		</ListItem>

		<ListItem style="width: 0" name="Actions">
			<Button size="sm" color="primary" on:click={() => onRollback(item.id)}
				>Rollback</Button>
		</ListItem>
	</ListBox>
</El>
