export async function load({ params, locals }) {
	const table = await locals.api.getTableBySlug(params.slug)
	const value = await locals.api
		.getData({ table: table.id, where: { id: params.id } })
		.then((res) => res.data![0])

	return {
		table,
		value,
	}
}
