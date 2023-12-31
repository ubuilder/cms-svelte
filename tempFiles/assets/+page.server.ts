import { fail } from '@sveltejs/kit'
import { join } from 'path'
import { getAssets } from '$lib/server/index.js'
import type { Actions } from './$types.js'

export async function load({ locals }) {
	const assets = await getAssets({ filters: locals.filters, api: locals.api })
	return {
		assets,
	}
}

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData())

		console.log('checking file....')
		if (!(formData.file as File).name || (formData.file as File).name === 'undefined') {
			console.log('failed')
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload',
			})
		}

		const { file } = formData as { file: File }

		console.log('uploading....')
		const res = await locals.api.uploadFile(file)

		// const [fileId] = locals.api.uploadFile({
		//   name: file.name,
		//   type: file.type.split('/')[0],
		//   size: file.size,
		//   alt: '',
		//   description: ''
		// })

		// const [fileId] = await locals.db("u-files").insert({
		//   name: file.name,
		//   type: file.type.split("/")[0],
		//   size: file.size,
		//   alt: "",
		//   description: "",
		// });

		// const filePath = join("data", locals.siteId, "assets", fileId);

		// await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

		return { success: true }
	},
	async remove(event) {
		const body = await event.request.json()

		await event.locals.api.removeAsset(body.id)

		return { success: true }
	},
	async update(event) {
		const body = await event.request.json()

		const id = body.id
		const data = body.data

		await event.locals.api.updateAsset(id, {
			name: data.name,
			alt: data.alt,
			description: data.description,
		})

		return { success: true }
	},
}
