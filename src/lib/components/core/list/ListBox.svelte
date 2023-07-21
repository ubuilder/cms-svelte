<script lang="ts">
	import { Card, Table, TableBody, TableCell, TableFoot, TableHead, TableRow } from 'yesvelte'
	import { setContext } from 'svelte'

	type T = $$Generic

	export let title: string = 'List'
	export let items: T[] = []

	let headers: { name: string; getFooter: (items: T[]) => string }[] = []

	function register(name: string, getFooter: (items: T[]) => string) {
		if (!headers.find((head) => head.name === name)) {
			headers = [...headers, { name, getFooter }]
		}
	}

	function unregister(name: string) {
		headers = headers.filter((head) => head.name !== name)
	}

	$: hasFooter = headers.some((header) => header.getFooter)
	setContext('LIST_BOX', { register, unregister })
</script>

<Card {...$$restProps} {title} if={items.length}>
	<Table>
		<TableHead>
			{#each headers as header}
				<TableCell px="2">{header.name}</TableCell>
			{/each}
		</TableHead>

		<TableBody>
			{#each items as item, index}
				<TableRow>
					<slot {item} {index} />
				</TableRow>
			{/each}
		</TableBody>
		<TableFoot if={hasFooter}>
			<TableRow>
				{#each headers as header}
					<TableCell>
						{#if header.getFooter}
							<b>
								{header.getFooter(items)}
							</b>
						{/if}
					</TableCell>
				{/each}
			</TableRow>
		</TableFoot>
	</Table>
</Card>
