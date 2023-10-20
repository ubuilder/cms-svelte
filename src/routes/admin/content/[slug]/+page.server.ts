import {error, fail} from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	async insert({ request, locals, params }) {
		const body = await request.json()

		const res = await locals.api.insertData({ table: params.slug, data: body })
		console.log(res)
		console.log({res})
		console.log(res)
		if(res.status !== 200) {
			return fail(res.status, {field: res.field, message: res.message})

		}


		return { success: true }
	},
	async update({ request, locals, params }) {
		const body = await request.json()

		const { id, ...data } = body

		await locals.api.updateData({ table: params.slug, id, data })

		return { success: true }
	},
	async remove({ request, locals, params }) {
		const body = await request.json()

		await locals.api.removeData({ table: params.slug, id: body.id })

		return { success: true }
	},
}
