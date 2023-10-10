import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  async default(event) {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    if(!username) return fail(400, { field: "username", message: "UserName is required" });
    if(!password) return fail(400, { field: "password", message: "Password is required" });
    const doesExist = await event.locals.db("u-users").query({where:{username }})
    console.log('does exist', doesExist)
    if(doesExist.total) return fail(409, { field: "username", message: "Already have an account" });

    //TODO get hashed password
    const user = await event.locals.db("u-users").insert({username, password: password + "_hashed"})
    if (!user) {
      return fail(500, { message: "Unknown error" });
    }
    event.cookies.set('auth', user, {
        path: '/',
        maxAge : 60
    })
    redirect(307, "/")
    return {
      success: true,
      code: 201,
      message: "user successfully created"
    };
  },
};
