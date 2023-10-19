import { redirect } from '@sveltejs/kit'

export const actions = {
	async createComponent(event) {
		const body = await event.request.json()

		console.log(body)
		const result = await event.locals.api.createComponent(body)

		throw redirect(301, '/admin/components/' + result.id)
	},
}
