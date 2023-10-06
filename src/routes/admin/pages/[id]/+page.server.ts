export async function load({ locals, params }) {
  const tables = await locals
    .db("u-tables")
    .query({ perPage: 100 })
    .then((x) => x.data);
  return {
    tables,
    page: await locals.db("u-pages").get({ where: { id: params.id } }),
  };
}

export const actions = {
  async addPage({ request, locals }) {
    const body = await request.json();

    const load = {
      blog: {
        table: "blogs",
        where: {
          slug: "{{page.slug}}",
        },
        // with: {
        //     author: {
        //         table: "u-users",
        //         field: "author_id",
        //     },
        // },
        // multiple: false
      },
    };

    locals.db("pages").insert({
      slug: body.slug,
      props: {
        title: body.title,
      },
      slot: body.slot,
      load: [],
    });
  },
  async updatePage({ request, locals }) {
    const body = await request.json();
    await locals.db("u-pages").update(body.id, body);

    return { success: true };
  },
  async removePage({ request, locals, params }) {
    console.log("remove page", params.id);
    const id = params.id;
    await locals.db("u-pages").remove(id)
    return { success: true };
  },
};
