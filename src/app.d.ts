// See https://kit.svelte.dev/docs/types#app

import type { Db, DbFilter } from "$lib/types";

// for information about these interfaces
type User = {
	id: string;
	name: string;
	email: string;
	username: string;
	password: string;
	profile: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Db;
			siteId: string;
			filters: DbFilter
			user: User
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
