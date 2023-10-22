<script lang="ts">
	import {
		ButtonList,
		Page,
		ListBox,
		FilterList,
		SelectFilter,
		TextFilter,
		DateFilter,
		NumberFilter,
		ListItem,
		confirmModal,
		Button,
		El,
		Icon,
		Status,
		Switch,
		Avatar,
	} from '@ulibs/yesvelte'
	import { invalidateAll } from '$app/navigation'

	import RelationItem from './[id]/RelationItem.svelte'
	import { t } from '$lib/i18n'

	export let data

	async function removeItem(item: any) {
		const choice = await confirmModal.open({
			status: 'danger',
			title: t('content.messages.remove_row'),
		})

		if (choice) {
			await fetch('?/remove', {
				method: 'POST',
				body: JSON.stringify({ id: item.id }),
			}).then((res) => res.json())

			await invalidateAll()
		}
	}
</script>

<Page title={data.table.name}>
	<svelte:fragment slot="title">
		<Icon mb="2" size="xl" name={data.table.icon} me="1" />
		{data.table.name}
		<Button ghost color="secondary" href="./edit">
			<Icon name="settings" />
		</Button>
	</svelte:fragment>
	<ButtonList slot="header-buttons">
		<Button href="..">
			<Icon name="chevron-left" />
			{t('buttons.back')}
		</Button>

		<Button href="../{data.table.slug}/insert" color="primary">
			<Icon name="plus" />
			{t('buttons.insert')}
		</Button>
	</ButtonList>

	<FilterList>
		{#each data.table.fields.filter((x) => x.show_in_list !== false) as field}
			{#if field.type === 'select'}
				<SelectFilter
					items={field.options.split(',').map((x) => x.trim()) ?? []}
					text={field.name}
					key={field.name} />
			{:else if field.type === 'switch'}
				<SelectFilter
					items={[
						{ key: true, text: t('content.filters.true') },
						{ key: false, text: t('content.filters.false') },
					]}
					text={field.name}
					key={field.name} />
			{:else if field.type === 'date_time'}
				<DateFilter key={field.name} text={field.name} />
			{:else if field.type === 'number'}
				<NumberFilter key={field.name} text={field.name} />
			{:else if field.type === 'plain_text' || field.type === 'rich_text'}
				<TextFilter text={field.name} key={field.name} />
			{/if}
		{/each}
	</FilterList>

	<ListBox title="" items={data.rows.data} let:item>
		{#each data.table.fields.filter((x) => x.show_in_list !== false) as field}
			<ListItem name={field.name}>
				{#if field.type === 'switch'}
					<Switch disabled checked={item[field.name]} />
				{:else if field.type === 'select'}
					<Status color="light">{item[field.name]}</Status>
				{:else if field.type === 'image'}
					<El tag="img" width="64px" src="/files/{item[field.name]}" />
				{:else if field.type === 'relation'}
					{#if field.multiple}
						{#each item[field.name] as x}
							<RelationItem value={x} table={field.table} title={field.title} />
						{/each}
					{:else}
						<RelationItem value={item[field.name]} table={field.table} title={field.title} />
					{/if}
				{:else}
					{item[field.name].substring(0, 100) + (item[field.name].length > 100 ? '...' : '')}
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
			<El d="flex" gap="2">
				<Button size="sm" href="../{data.table.slug}/{item.id}">
					<Icon name="eye" />
				</Button>
				<Button color="primary" size="sm" href="../{data.table.slug}/{item.id}/edit">
					<Icon name="pencil" />
				</Button>
				<Button color="danger" size="sm" on:click={() => removeItem(item)}>
					<Icon name="trash" />
				</Button>
			</El>
		</ListItem>
		<El gap="2" d="flex" justifyContent="end" px="3" py="2" slot="end">Pagination...</El>
	</ListBox>
</Page>
