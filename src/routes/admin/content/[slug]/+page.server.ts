import {error, fail} from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	async remove({ request, locals, params }) {
		const body = await request.json()

			// get id of table (TODO: from frontend)
			const table = await locals.api.getTableBySlug(params.slug)


		await locals.api.removeData({ table: table.id, id: body.id })

		return { success: true }
	},
}
