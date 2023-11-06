import { respond } from '$lib/helpers/api.js'

export async function GET({ request, locals, url }) {
	const response: any = {}

	const assets = await locals.api.getAssets({ perPage: 100 })
	console.log(assets)

	return respond(assets.status, assets.message, assets.data.data)
}

export async function POST({ request, locals, url }) {
	if (url.searchParams.get('id')) {
		const data = await request.json()

		const id = url.searchParams.get('id')
		const res = await locals.api.updateAsset(id, data)

		return respond(res.status, res.message, res.data)
	}
	const data = await request.formData()

	// upload file
	const res = await locals.api.uploadFile(data)

	return respond(res.status, res.message, res.data)
}

export async function DELETE({ request, locals, url: { searchParams } }) {
	const res = await locals.api.removeAsset(searchParams.get('id'))
	return respond(res.status, res.message, res.data)
}
