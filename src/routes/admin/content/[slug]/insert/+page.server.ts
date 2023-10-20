import { fail, type Actions } from '@sveltejs/kit'

export async function load({ params, locals }) {
	const table = await locals.api.getTableBySlug(params.slug)

	return {
		table,
	}
}

export const actions: Actions = {
	async insert({ request, locals, params }) {
		const body = await request.formData()

		var data: any = {};
		body.forEach(function(value, key){
			data[key] = value;
			});

		const res = await locals.api.insertData({ table: params.slug, data })
		console.log(res)
		console.log({res})
		console.log(res)
		if(res.status !== 200) {
			return fail(res.status, {field: res.field, message: res.message})

		}


		return { success: true }
	}
}
