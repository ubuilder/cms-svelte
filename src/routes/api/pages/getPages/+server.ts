export async function POST({request, locals}) {
    const filters: any = await request.json()
    const data = await locals.db('u-pages').query(filters);
    
    return new Response(JSON.stringify({data, status: 200, message: 'Success'}))
}