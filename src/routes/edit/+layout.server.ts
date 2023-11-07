// import i18n from '$lib/i18n/index.js';

import { setLang } from '$lib/i18n'

// import '$lib/helpers';

export const trailingSlash = 'always'
// export const ssr = false

const show_auth_warning = true

export async function load({ request, locals }) {

	console.log('locals', locals)
	console.log('user: ', locals.user)
	
	function getDir(lang: 'en' | 'fa' | 'ps') {
		return lang === 'fa' || lang === 'ps' ? 'rtl' : 'ltr'
	}

	return {
		user: locals.user,
		lang: locals.settings.lang,
		dir: getDir(locals.settings.lang),
		theme: locals.settings.theme ?? 'light',
		siteId: locals.siteId,
		// menu: locals.settings.menu ?? []
	}
}
