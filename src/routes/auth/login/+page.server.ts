import { fail } from "@sveltejs/kit";

export const actions = {
  async login(event) {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    console.log(event.locals.siteId)
    const user = await event.locals.db("u-users").get({ where: { username } });

    console.log(user)
    if (!user) {
      return fail(401, { field: 'username', message: "this account does not exist" });
    }

    if (user.password !== password + "_hashed") {
      return fail(401, { field: 'password', message: "Password is incorrect" });
    }

    event.cookies.set('auth', user.id, {
        path: '/'
    })
    
    return {
      success: true,
    };
  },
};
