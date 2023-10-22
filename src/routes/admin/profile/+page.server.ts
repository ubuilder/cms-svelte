import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
	return {
		userData: await locals.api.getUser().then((res) => res.data),
	}
}

export const actions = {
	async default({ locals, request }) {
		const body = await request.formData()

		const username = body.get('username')
		const name = body.get('name')
		const email = body.get('email')
		const profile = body.get('profile')

		await locals.api.updateProfile({ username, name, email, profile })

		throw redirect(302, '/admin/profile?success')
	},
}
