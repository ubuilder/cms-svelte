import { stringify } from 'qs'
export async function api(url: string, { params, data, formData }: any = {}) {
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

	const paramsStr = params ? `?${stringify(params)}` : ''
	const res: {message: string, status: number, data: any} = await fetch('/api' + url + paramsStr, opts).then((res) => res.json())

	return res
}
