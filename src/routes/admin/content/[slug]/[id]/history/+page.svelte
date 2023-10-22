<script lang="ts">
	import { goto } from '$app/navigation'
	import {
		Button,
		El,
		Page,
		PageHeader,
		ListBox,
		ListItem,
		Status,
		Switch,
		Avatar,
	} from '@ulibs/yesvelte'
	import RelationItem from '../RelationItem.svelte'
	import { t } from '$lib/i18n'

	export let data

	function onRollback(history_id: string) {
		fetch('?/rollback', {
			method: 'POST',
			body: JSON.stringify({ history_id }),
		}).then((res) => {
			goto('..', { invalidateAll: true })
		})
	}
</script>

<El container="lg">
	<PageHeader title="{t('content.history')} | {data.table.name} (id...)" back />
	<ListBox mt="3" title="" items={data.rows.data.data} let:item>
		<ListItem name=" Operation">{item.type}</ListItem>
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
						{item[field.name].substring(0, 100) + (item[field.name].length > 100 ? '...' : '')}
					{/if}
				{:else if item.type === 'remove'}
					<El textColor="success">---</El>
				{:else if item.type === 'recover'}
					<El textColor="success">---</El>
				{/if}
			</ListItem>
		{/each}
		<ListItem name={t('content.created_at')} style="white-space: nowrap;">
			{new Date(item.created_at).toDateString()}
		</ListItem>
		<ListItem name={t('content.created_by')}>
			{#if item.created_by}
				<Status color="light" ps="1" d="flex">
					<Avatar style="width: 1.25rem; height: 1.25rem" shape="circle">
						<img alt="user" src="/files/{item.created_by.profile}" />
					</Avatar>
					<El tag="strong">{item.created_by.username}</El>
				</Status>
			{:else}
				<Status color="light">Unknown</Status>
			{/if}
		</ListItem>

		<ListItem style="width: 0" name={t('content.actions')}>
			<Button size="sm" color="primary" on:click={() => onRollback(item.id)}>
				{t('content.rollback')}
			</Button>
		</ListItem>
	</ListBox>
</El>
