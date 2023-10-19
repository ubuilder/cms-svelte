import type { Actions, ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ params, locals }) => {
	if (!params.slug) return {}

	const table = await locals.api.getTableBySlug(params.slug)

	// const rows = await locals.api(params.slug).history({where: {id: params.id}, perPage: 50});
	const rows = []

	return {
		table,
		rows,
	}
}

export const actions: Actions = {
	async rollback({ request, params, locals }) {
		const body = await request.json()

		// await locals.db(params.slug).rollback(params.id, body);

		return { success: true }
	},
}
