export async function load({ locals }) {
	return {
		settings: locals.settings,
	}
}

export const actions = {
	async save({ request, locals }) {
		await locals.api.setSettings(await request.json())
		return { success: true }
	},
}
