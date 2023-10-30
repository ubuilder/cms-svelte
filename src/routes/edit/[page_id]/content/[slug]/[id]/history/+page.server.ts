import type { Actions, ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ params, locals }) => {
	if (!params.slug) return {}

	const table = await locals.api.getTableBySlug(params.slug)

	const rows = await locals.api.getDataHistory({table: table.id, perPage: 100, where: {data: {id: params.id}}})
	console.log(rows)

	return {
		id: params.id,
		table,
		rows,
	}
}

export const actions: Actions = {
	async rollback({ request, params, locals }) {
		const body = await request.json()

		const table = await locals.api.getTableBySlug(params.slug)
		await locals.api.recoverData(table.id, body.history_id)
		// await locals.db(params.slug).rollback(params.id, body);

		return { success: true }
	},
}
