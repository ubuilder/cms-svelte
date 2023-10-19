export async function load({ params, locals }) {
	const table = await locals.api.getTableBySlug(params.slug)

	return {
		table,
	}
}
