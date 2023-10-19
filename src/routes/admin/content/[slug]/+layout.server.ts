import type { DbTable, Table } from '$lib/types'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ params, locals }) => {
	const table = await locals.api
		.getTables({ where: { slug: params.slug! } })
		.then((res) => res.data!.data[0])

	const rows = await locals.api.getData({
		where: locals.filters,
		table: params.slug,
	})

	return {
		table,
		rows,
	}
}
