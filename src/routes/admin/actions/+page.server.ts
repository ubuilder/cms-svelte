export async function load({locals}) {
    const actions = await locals.db('u-actions').query({perPage: 50, where: locals.filters}).then(res => res.data)

    return {
        actions
    }
}

function slugify(str: string, separator = '_') {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === " " || str[i] === "-" || str[i] === ":" || str[i] === "_") {
        result += separator;
        i++;
      }
      result += str[i].toLowerCase();
    }
    return result;
} 

export const actions = {
    async create(event:any) {
        const body = await event.request.json()

        await event.locals.db('u-actions').insert({
            name: body.name,
            slug: slugify(body.name),
            fields: body.fields
        })

        return {success: true}
    },
    async update(event:any) {
        const body = await event.request.json()

        await event.locals.db('u-tables').update(body.id, {
            name: body.name,
            fields: body.fields
        })

        return {success: true}
    } 

}