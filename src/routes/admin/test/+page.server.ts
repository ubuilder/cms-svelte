export async function load({ cookies, locals }) {
	return {
		token: cookies.get('token'),
		siteId: locals.siteId,
	}
}
