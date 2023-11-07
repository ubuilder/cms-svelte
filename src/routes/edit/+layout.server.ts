// import i18n from '$lib/i18n/index.js';

import { setLang } from '$lib/i18n'

// import '$lib/helpers';

export const trailingSlash = 'always'
// export const ssr = false

const show_auth_warning = true

export async function load({ request, locals }) {
	console.log('in layou load')

	// INITIALIZE translations
	// await i18next.changeLanguage("en")

	// i18n.locale = 'fa'

	console.log('locals', locals)
	console.log('user: ', locals.user)
	
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
		// menu: locals.settings.menu ?? []
	}
}
