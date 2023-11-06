import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
	const components = await locals.api
		.getComponents({ where: locals.filters, perPage: 500 })
		.then((res) => res.data)

	return {
		components,
	}
}
