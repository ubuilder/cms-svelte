import { slugify } from '$lib/helpers/index.js'
import type { Table } from '$lib/types/table.js'
import type { Actions } from './$types'

export const actions: Actions = {
	async create(event) {
		const body = await event.request.json()

		await event.locals.api.createTable({
			name: body.name,
			icon: body.icon,
			fields: body.fields,
		})

		return { success: true }
	},
	async update(event) {
		const body = await event.request.json()

		await event.locals.api.updateTable({
			id: body.id,
			data: {
				name: body.name,
				icon: body.icon,
				fields: body.fields,
			},
		})

		return { success: true }
	},
	async remove(event) {
		const body = await event.request.json()

		await event.locals.api.removeTable(body.id)

		// // remove {table.slug} table
		// const fileName = `./data/${event.locals.siteId}/db.json`

		// const data = JSON.parse(await readFile(fileName, 'utf-8'));

		// // console.log('table slug: ', table.slug, table)
		// delete data[table.slug]

		// await writeFile(fileName, JSON.stringify(data));

		return { success: true }
	},
}
