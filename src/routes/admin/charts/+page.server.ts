import { redirect } from '@sveltejs/kit'

export const actions = {
	async createChart(event) {
		const body = await event.request.json()

		console.log(body)
		const result = await event.locals.api.createChart(body)

		throw redirect(301, '/admin/charts/' + result.id)
	}
}
    