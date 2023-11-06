import { respond } from '$lib/helpers/api.js'

export async function GET({ request, locals, url }) {
	if (url.searchParams.get('id')) {
		const id = url.searchParams.get('id')
		const res = await locals.api.getTable(id)

		return respond(res.status, res.message, res.data)
	}

	const res = await locals.api.getTables({ perPage: 100 })

	return respond(res.status, res.message, res.data.data)
}

export async function POST({ request, locals, url }) {
	const body = await request.json()

	if (url.searchParams.get('id')) {
		const id = url.searchParams.get('id')
		const res = await locals.api.updateTable({ id, data: body })

		return respond(res.status, res.message, res.data)
	}

	const res = await locals.api.createTable(body)

	return respond(res.status, res.message, res.data)
}

export async function DELETE({ request, locals, url: { searchParams } }) {
	const res = await locals.api.removeTable(searchParams.get('id'))
	return respond(res.status, res.message, res.data)
}
