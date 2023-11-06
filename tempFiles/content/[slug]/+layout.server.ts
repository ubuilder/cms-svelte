import type { DbTable, Table } from '$lib/types'
import type { ServerLoad } from './$types';

export const load: ServerLoad = async ({ params, locals }) => {
	const table = await locals.api.getTableBySlug(params.slug)
		

	const rows = await locals.api.getData({
		where: locals.filters,
		table: table.id,
	})

	return {
		table,
		rows,
	}
}
