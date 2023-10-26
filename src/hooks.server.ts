import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import qs from 'qs'
import { cms_api } from '$lib/helpers/cms-api'
import { API_URL } from '$env/static/private'
import { redirect } from '@sveltejs/kit'

const apiUrl = API_URL ?? 'http://localhost:3000'

export const handle = async ({ event, resolve }) => {

	let siteId = (event.url.host ?? 'default').split('.')[0]
	// let siteId = 'localhost:5173'
	const baseUrl = apiUrl + '/api/' + siteId
	const token = event.cookies.get('token') ?? ''
	
	event.locals.api = cms_api({
		baseUrl,
		fetch: event.fetch,
		token,
	})

	event.locals.baseUrl = baseUrl
	event.locals.token = token

	

	// /admin
	if (event.url.pathname.startsWith('/admin/')) {
		// settings
		event.locals.settings = (await event.locals.api.getSettings()) ?? {}

		// auth
		if (event.cookies.get('token')) {
			const user = await event.locals.api.getUser().then((res) => res.data)
	
			if (user) {
				event.locals.user = user
			}
		}
	
		if (!event.locals.user) {
			const hasUser = await event.locals.api.hasUser().then(res => res.data)
			if(hasUser) {
				throw redirect(307, '/auth/login?fromAdmin=true&redirect=' + event.url.pathname)
			} else {
				throw redirect(307, '/auth/register?fromAdmin=true&redirect=' + event.url.pathname)
			}			
		}


		// filters
		if (event.request.method === 'GET') {
			const obj = qs.parse(event.url.search.substring(1))
	
			event.locals.filters = obj.filters
		}
	}

	// /auth
	if(event.url.pathname.startsWith('/auth/')) {
		const hasUser = await event.locals.api.hasUser().then(res => res.data)

		if(hasUser) {
			if(event.url.pathname !== '/auth/login') {
				throw redirect(307, '/auth/login?fromRegister=true')
			}
		} else {
			if(event.url.pathname !== '/auth/register') {
				throw redirect(307, '/auth/register?fromLogin=true')
			}
		}			
	}

	event.locals.siteId = siteId

	return resolve(event)
}

