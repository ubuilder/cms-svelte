export async function GET({ locals, params }) {
	const data = await locals.api.getData({ table: params.table, perPage: 100 })

	return new Response(JSON.stringify(data))
}
