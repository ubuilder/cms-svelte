import type { Page } from '$lib/types/page.js'
import type { Table } from '$lib/types/table.js'

export async function load({ locals, params }) {
	const tables = await locals.api
		.getTables({ perPage: 50, where: locals.filters })
		.then((res) => res.data!.data)
	const components = await locals.api.getComponents({ perPage: 500 }).then((res) => res.data)

	const forms = await locals.api.getForms(params.page_id).then((res) => res.data)

	console.log({ forms })
	return {
		tables,
		components,
		page: await locals.api.getPage(params.page_id),
		forms,
	}
}

export const actions = {
	async updatePage({ request, locals }) {
		const { id, ...data } = await request.json()

		await locals.api.updatePage({ id, data })

		return { success: true }
	},
	async removePage({ request, locals, params }) {
		console.log('remove page', params.page_id)
		const id = params.page_id
		await locals.api.removePage(id)

		return { success: true }
	},
}
