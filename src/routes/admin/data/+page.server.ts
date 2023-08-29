export async function load({locals}) {
    const tables = await locals.db('tables').query({perPage: 50}).then(res => res.data)

    return {
        tables
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
    async create(event) {
        const body = await event.request.json()

        await event.locals.db('tables').insert({
            name: body.name,
            slug: slugify(body.name),
            icon: body.icon,
            fields: body.fields
        })

        return {success: true}
    },
    async update(event) {
        const body = await event.request.json()

        await event.locals.db('tables').update(body.id, {
            name: body.name,
            icon: body.icon,
            fields: body.fields
        })

        return {success: true}
    } 

}