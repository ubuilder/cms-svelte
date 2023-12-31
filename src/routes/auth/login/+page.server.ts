import { fail, redirect } from '@sveltejs/kit'

export async function load({ url }) {
	let data: any = {}
	if (url.searchParams.get('fromRegister')) {
		data.fromRegister = true
	}
	if (url.searchParams.get('fromAdmin')) {
		data.fromAdmin = true
	}
	const redirectTo = url.searchParams.get('redirect')
	if (redirectTo && redirectTo !== '/edit/logout') {
		data.redirect = redirectTo
	}

	data.theme = 'dark'

	console.log(data, url.searchParams)
	return data;
}

export const actions = {
	async login(event) {
		console.log(event.url)
		const formData = await event.request.formData()
		const username = formData.get('username')
		const password = formData.get('password')

		let redirectTo = event.url.searchParams.get('redirect')
		// console.log(redirectTo, event.url)
		if(!redirectTo || redirectTo === 'undefined') redirectTo = '/edit/'

		const response = await event.locals.api.login({ username, password })
		if (response.status !== 200) {
			return fail(response.status, {
				field: response.field,
				message: response.message,
			})
		}

		event.cookies.set('token', response.data.token, {
			path: '/',
			maxAge: 60 * 60 * 24 * 15,
		})

		console.log('redirectTo: ', redirectTo)
		throw redirect(301, redirectTo )

	},
}
