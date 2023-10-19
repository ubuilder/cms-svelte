import fa from './fa'
import en from './en'
import ps from './ps'

const translations: any = {
	en,
	fa,
	ps
}

let lang = 'en'

export function setLang(lng: string) {
	if (lng) {
		console.log('set lang', lng)
		lang = lng
	}
}

export const t = (key: string) => {
	console.log('t', key, translations[lang])
	const keys = key.split('.')
	console.log(keys)
	const result = keys.reduce((prev, curr) => {
		console.log({ prev, curr })
		if (!prev || !prev[curr]) return key
		return prev[curr]
	}, translations[lang])

	console.log({ result })
	return result
}
