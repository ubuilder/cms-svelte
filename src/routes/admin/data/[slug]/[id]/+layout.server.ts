export async function load({params, locals}) {
    const table = await locals.db('u-tables').get({where: {slug: params.slug }})


    const value = await locals.db(table.slug).get({where: {id: params.id}})   

    return {
        table,
        value
    }
}