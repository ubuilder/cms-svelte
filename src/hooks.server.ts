import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import qs from 'qs'
import { cms_api } from '$lib/helpers/cms-api'
import { API_URL } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { setLang } from '$lib/i18n'

const enable_test_user = true

const apiUrl = API_URL ?? 'http://localhost:3000'

export const handle = async ({ event, resolve }) => {
	// const { getModel } = connect({ filename: "data/" + siteId + "/db.json" }); // based on url
	//   event.locals.db = (table: string) => {
	//   const db = getModel(table);
	//   const historyDb = getModel(table + '_history');

	//   async function insert(data: any) {
	//     const res = await db.insert(data)
	//     await historyDb.insert({...res, _is_deleted: false})
	//     return res;
	//     // const [id] = await db.insert({...data,
	//     //   _is_deleted: false,
	//     //   _published: true
	//     // })
	//     // await db.update(id, {
	//     //   _id: id
	//     // })

	//     // return [id]
	//   }

	//   async function update(id: string, data: any) {
	//     await historyDb.insert(data);
	//     // Audit table
	//     return db.update(id, data)
	//     // return db.insert({
	//     //   _id: id,
	//     //   data,
	//     //   _is_deleted: false,
	//     //   _published: false,
	//     // })
	//   }

	//   // async function query({where, with: with_}: any) {
	//     // return db.query({
	//     //   where: {...where, _is_deleted: false, _published: true},
	//     //   with: with_
	//     // })
	//   // }

	//   // async function get({where, with: with_}: any) {
	//   //   if(where['id']) {
	//   //     where['_id'] = where['id']
	//   //     delete where['id']
	//   //   }

	//   //   return db.get({
	//   //     where: {...where, _is_deleted: false, _published: true},
	//   //     with: with_
	//   //   })
	//   // }
	//   async function remove(id: string) {
	//     await historyDb.insert({id, _is_deleted: true});
	//     return db.remove(id)
	//     // const data = await db.get({where: {_id: id}})
	//     // return db.update(data.id, {
	//     //   _is_deleted: true
	//     // })
	//   }

	//   return {
	//     insert,
	//     update,
	//     remove,
	//     get: db.get,
	//     query: db.query,
	//     history: historyDb.query,
	//     rollback: (id: string, item: any) => {
	//       return db.update(id, item);
	//     }
	//     // async publish(new_id: string) {
	//     //   const data = await db.get({where: {id: new_id}});

	//     //   await db.update(data.id, {
	//     //     is_published: false
	//     //   })
	//     //   await db.update(new_id, {
	//     //     is_published: true
	//     //   })
	//     // }
	//   }
	// }

	let siteId = import.meta.env.PUBLIC_SITE_ID ?? (event.request.headers.get('host') ?? '').split('.')[0]
	// let siteId = '5173'
	event.locals.api = cms_api({
		baseUrl: apiUrl + '/api/' + siteId,
		fetch: event.fetch,
		token: event.cookies.get('token') ?? '',
	})

	// if not user and route starts with admin:
	// redirect to login page
	if (event.request.url.includes('/admin/')) {
		if (event.cookies.get('token')) {
			const user = await event.locals.api.getUser().then((res) => res.data)
	
			if (user) {
				event.locals.user = user
			}
		}
	
		event.locals.settings = (await event.locals.api.getSettings()) ?? {}
		// setLang('fa')
		if (!event.locals.user) {
			throw redirect(307, '/auth/login')
		}
	}

	// if(!event.locals.user && event.request.headers.get('host')?.includes('localhost') && enable_test_user) {
	//   event.locals.user = {
	//     id: '123',
	//     name: 'Default',
	//     email: 'default@gmail.com',
	//     username: 'default',
	//     profile: '',
	//     password: '123_hashed'
	//   }
	// }

	event.locals.siteId = siteId

	if (event.request.method === 'GET') {
		const obj = qs.parse(event.url.search.substring(1))

		event.locals.filters = obj.filters
	}

	return resolve(event)
}

