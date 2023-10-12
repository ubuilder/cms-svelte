// See https://kit.svelte.dev/docs/types#app

import type { cms_api } from "$lib/server/cms-api";
import type { Db, DbFilter } from "$lib/types";

// for information about these interfaces
export type User = {
	id: string;
	name: string;
	email: string;
	username: string;
	password: string;
	profile: string;
}

type Api = ReturnType<typeof cms_api>

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Db;
			siteId: string;
			filters: DbFilter
			user: User;
			api: Api
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
