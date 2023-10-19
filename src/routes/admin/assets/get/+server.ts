import { getAssets } from '$lib/server/index.js'

export async function POST(event) {
	const filters = await event.request.json()

	const assets = await getAssets({ filters, api: event.locals.api })

	return new Response(JSON.stringify({ assets }))
}
