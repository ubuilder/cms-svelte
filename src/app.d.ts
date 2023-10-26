// See https://kit.svelte.dev/docs/types#app

import type { cms_api } from '$lib/helpers/cms-api'
import type { DbFilter } from '$lib/types'

// for information about these interfaces
export type User = {
	id: string
	name: string
	email: string
	username: string
	password: string
	profile: string
}

type Api = ReturnType<typeof cms
_api>

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// db: Db;
			siteId: string
			filters: DbFilter
			user: User
			baseUrl: string
			token: string
			api: Api
			settings: any
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
