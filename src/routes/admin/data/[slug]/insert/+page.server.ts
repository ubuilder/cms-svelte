export async function load({params, locals}) {
    const table = await locals.db('u-tables').get({where: {slug: params.slug }})

    return {
        table,
    }
}