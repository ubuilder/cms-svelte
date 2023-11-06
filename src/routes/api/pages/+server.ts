import { respond } from '$lib/helpers/api.js'

export async function GET({ request, locals, url }) {
	if (url.searchParams.get('id')) {
		const id = url.searchParams.get('id')
		const res = await locals.api.getPage(id)

		return respond(res.status, res.message, res.data)
	}

	const response: any = {}

	const pages = await locals.api.getPages({ perPage: 100 })
	console.log(pages)

	return respond(pages.status, pages.message, pages.data.data)
}

export async function POST({ request, locals, url }) {
	const body = await request.json()

	if (url.searchParams.get('id')) {
		const id = url.searchParams.get('id')
		const res = await locals.api.updatePage({ id, data: body })

		return respond(res.status, res.message, res.data)
	}

	const res = await locals.api.createPage(body)

	return respond(res.status, res.message, res.data)
}

export async function DELETE({ request, locals, url: { searchParams } }) {
	const res = await locals.api.removePage(searchParams.get('id'))

	return respond(res.status, res.message, res.data)
}
