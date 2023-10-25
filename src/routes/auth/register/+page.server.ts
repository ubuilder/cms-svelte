import { fail, redirect } from '@sveltejs/kit'

export async function load({url, locals}) {
	let data: any = {}
	if(url.searchParams.get('fromLogin')) {
		data.fromLogin = true
	}
	if(url.searchParams.get('fromAdmin')) {
		data.fromAdmin = true
	}
	if(url.searchParams.get('redirect')) {
		data.redirect = url.searchParams.get('redirect')
	}

	
	data.theme = 'dark'

	console.log(data, url.searchParams)
	return data;
}

export const actions = {
	async register(event) {
		const formData = await event.request.formData()
		const username = formData.get('username')
		const password = formData.get('password')
		const name = formData.get('name')
		const email = formData.get('email')


		const redirectTo = event.url.searchParams.get('redirect')
		

		if (!username) return fail(400, { field: 'username', message: 'Username is required' })
		if (!password) return fail(400, { field: 'password', message: 'Password is required' })

		const response = await event.locals.api.register({
			username,
			password,
			email,
			name,
		})

		if (response.status !== 200) {
			return fail(response.status, { message: response.message })
		}

		event.cookies.set('token', response.data?.token, {
			path: '/',
			maxAge: 60 * 60 * 24 * 15,
		})

		throw redirect(301, redirectTo ?? '/admin/')
		// return {
		// 	success: true,
		// 	code: 201,
		// 	message: 'user successfully created',
		// }
	},
}
