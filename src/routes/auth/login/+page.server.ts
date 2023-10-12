import { fail } from "@sveltejs/kit";
export const actions = {
  async login(event) {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await event.locals.api.login({username, password})
    if (!response.data) {
      return fail(response.status, { field: 'username', message: response.message });
    }

    // if (user.password !== password + "_hashed") {
    //   return fail(401, { field: 'password', message: "Password is incorrect" });
    // }

    event.cookies.set('token', response.data.token, {
        path: '/',
        maxAge: 60 * 60 * 24 *15
    })
    
    return {
      success: true,
    };
  },
};
