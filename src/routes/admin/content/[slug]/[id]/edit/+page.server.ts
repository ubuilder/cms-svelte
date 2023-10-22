import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	async update({ request, locals, params }) {
		const body = await request.formData()

		var data: any = {}
		body.forEach((value, key) => {
			// Reflect.has in favor of: object.hasOwnProperty(key)
			if (!Reflect.has(data, key)) {
				data[key] = value
				return
			}
			if (!Array.isArray(data[key])) {
				data[key] = [data[key]]
			}
			data[key].push(value)
		})

		// get id of table
		const table = await locals.api.getTableBySlug(params.slug)

		const res = await locals.api.updateData({ table: table.id, data, id: data.id })

		if (res.status !== 200) {
			return fail(res.status, { field: res.field, message: res.message })
		}

		throw redirect(301, '../..')
	},
}
