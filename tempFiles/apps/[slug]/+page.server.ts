export async function load({ cookies, params, parent }) {
	const data = await parent()

	const app = data.apps.find((x) => x.slug === params.slug)

	if (app) {
		try {
			await fetch(app?.url).then((res) => {
				console.log(res)
			})

			return {
				token: cookies.get('token'),
				fail: false,
				app,
			}
		} catch (err) {
			return { app, fail: true }
		}
	}

	return {}
}
