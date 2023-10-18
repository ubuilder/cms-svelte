import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  async default(event) {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const name = formData.get("name");
    const email = formData.get("email");

    if(!username) return fail(400, { field: "username", message: "UserName is required" });
    if(!password) return fail(400, { field: "password", message: "Password is required" });

    const response = await event.locals.api.register({username, password, email, name})
    
    if(response.status !==200) {
      return fail(response.status, {message: response.message});
    }

    event.cookies.set('token', response.data?.token, {
        path: '/',
        maxAge : 60  * 60 * 24 * 15
    })


    return {
      success: true,
      code: 201,
      message: "user successfully created"
    };
  },
};
