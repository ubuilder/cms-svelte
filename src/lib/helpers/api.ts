import { stringify } from 'qs'
export async function api(url: string, { params, data, formData, method }: any = {}) {
	console.log('api: ' + url + '?' + stringify(params), data)
	const opts: any = {}

	if (formData) {
		opts.method = 'POST'
		opts.body = formData
	} else if (data) {
		opts.method = 'POST'

		opts.headers = {
			'content-type': 'application/json',
		}
		opts.body = JSON.stringify(data)
	}

	opts.method = method

	const paramsStr = params ? `?${stringify(params)}` : ''
	const res: {message: string, status: number, data: any} = await fetch('/api' + url + paramsStr, opts).then((res) => res.json())

	return res
}
