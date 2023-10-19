// import i18n from '$lib/i18n/index.js';

import { setLang } from '$lib/i18n'

// import '$lib/helpers';

export const trailingSlash = 'always'
export const ssr = false

const show_auth_warning = true

export async function load({ request, locals }) {
	console.log('in layou load')

	// INITIALIZE translations
	// await i18next.changeLanguage("en")

	// i18n.locale = 'fa'

	console.log('user: ', locals.user)
	const apps = [
		{
			id: 'xvsawe',
			slug: 'test-api',
			repo: 'ubuilder/cms-app-test-api',
			url: 'https://cms-app-test-api.hadiahmadi.dev',
			// url: "http://localhost:5174",
			name: 'Test API',
			icon: 'test',
		},
		{
			id: 'xvsaw234',
			slug: 'file-manager',
			repo: 'ubuilder/file-manager',
			url: 'https://cms-app-file-manager.hadiahmadi.dev/assets',
			// url: "http://localhost:5174/assets",
			name: 'File Manager',
			icon: 'folder',
		},
	]

	function getDir(lang: 'en' | 'fa' | 'ps') {
		return lang === 'fa' || lang === 'ps' ? 'rtl' : 'ltr'
	}

	return {
		show_auth_warning: request.headers.get('host')?.includes('localhost') && show_auth_warning,
		user: locals.user,
		lang: locals.settings.lang,
		dir: getDir(locals.settings.lang),
		theme: locals.settings.theme ?? 'dark',
		siteId: locals.siteId,
		apps,
	}
}
