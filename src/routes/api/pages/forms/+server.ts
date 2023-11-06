import { respond } from '$lib/helpers/api.js'

export async function GET({ request, locals, url }) {
	if (url.searchParams.get('id')) {
		const id = url.searchParams.get('id')
		const res = await locals.api.getForms(id)

		return respond(res.status, res.message, res.data)
	}
    return respond(200, '', [])
}