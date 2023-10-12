export async function load({locals}) {
    const tables = await locals.api.getTables({perPage: 50, where: locals.filters}).then(res => res.data!.data)
    
    return {
        tables
    }
}
