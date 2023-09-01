// See https://kit.svelte.dev/docs/types#app
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
			db: any;
			siteId: string;
			filters: Record<string, object>
			user: User
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
