import type { ServerLoadEvent } from '@sveltejs/kit'

export async function load({ locals }: ServerLoadEvent) {
	return {
		pages: await locals.api.getPages().then(res => res.data.data),
		settings: locals.settings,
	}
}

export const actions = {
	async save({ request, locals }) {
		await locals.api.setSettings(await request.json())

		locals.settings = await locals.api.getSettings()
		
		return { success: true }
	},
}
