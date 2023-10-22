import { fail } from "@sveltejs/kit";
export const actions = {
	async login(event) {
		const formData = await event.request.formData()
		const username = formData.get('username')
		const password = formData.get('password')

		const response = await event.locals.api.login({ username, password })
		if (response.status !== 200) {
			return fail(response.status, {
				field: response.field,
				message: response.message,
			})
		}

    event.cookies.set('token', response.data.token, {
        path: '/',
        maxAge: 60 * 60 * 24 *15
    })
    
    return {
      success: true,
    };
  },
};
