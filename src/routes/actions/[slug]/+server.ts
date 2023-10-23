export async function POST(event: any) {
	const body = await event.request.json()

	const slug = event.params.slug
	const tableName = body.table;

	console.log('action: ', {slug, body})
	
	console.log('locals: ', event.locals)
	const tables = await event.locals.api.getTables()
	console.log(tables)
	const table = await event.locals.api.getTableBySlug(tableName)
	console.log(table)

	if(table) {

	if(slug === 'create') {
		const data = body.data;

		

		await event.locals.api.insertData({
			table: table.id,
			data
		})
	}
	
	if(slug === 'update') {
		const data = body.data;
		const id = body.id;
	
	
		await event.locals.api.updateData({
			table: table.id,
			id,
			data
		})
	}
	
	if(slug === 'remove') {
		const id = body.id;
		
		await event.locals.api.removeData({
			table: table.id,
			id
		})
	}
}

	


	// if (event.params.slug === 'create') {
	// 	const data = body.data
	// 	const table = body.table

	// 	await event.locals.api.insertData({ table, data })
	// } else if (event.params.slug === 'remove') {
	// 	const data = body.data
	// 	const table = body.table

	// 	await event.locals.api.removeData({ table, id: data.id })
	// }

	// console.log('action called: ', event.params.slug, body)
	return new Response(JSON.stringify({ success: true, body, action: event.params.slug }))
}
