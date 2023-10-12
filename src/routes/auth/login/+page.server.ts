import { fail } from "@sveltejs/kit";
export const actions = {
  async login(event) {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const user = await event.locals.db("u-users").get({ where: { username } });

    if (!user) {
      return fail(401, { field: 'username', message: "this account does not exist" });
    }

    if (user.password !== password + "_hashed") {
      return fail(401, { field: 'password', message: "Password is incorrect" });
    }

    event.cookies.set('auth', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 *15
    })
    
    return {
      success: true,
    };
  },
};
