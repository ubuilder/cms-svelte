export async function GET({locals, params}) {
    const data = await locals.db(params.table).query({perPage: 100})


    return new Response(JSON.stringify(data));
}