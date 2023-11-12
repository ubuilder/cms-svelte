import { stringify } from 'qs'
export async function api(url: string, { params, data, formData, method }: any = {}) {
	// console.log('api: ' + url + '?' + stringify(params), data)
	const opts: any = {}

	if (formData) {
		opts.method = 'POST'
		opts.body = formData

		console.log(formData.get('file'))
	} else if (data) {
		opts.method = 'POST'

		opts.headers = {
			'content-type': 'application/json',
		}
		opts.body = JSON.stringify(data)
	}

	opts.method ??= method
	
	const paramsStr = params ? `?${stringify(params)}` : ''
	const res: {message: string, status: number, data: any} = await fetch('/api' + url + paramsStr, opts).then((res) => res.json())

	return res
}
export function respond(status = 200, message = "", data = {}) {
    const response: any = {}

    response.message = message
    response.status = status
    response.data = data;
    
    
    return new Response(JSON.stringify(response))    
}
