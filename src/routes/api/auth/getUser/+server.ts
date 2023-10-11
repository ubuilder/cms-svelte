export async function POST({request, locals}) {
    const authorization = request.headers.get('Authorization') ?? ''
    const token = authorization.split(' ')[1]

    const data = await locals.db('u-users').get({where: {id: token}})
    // const res = await locals.db('u-pages').query(filters);
    
    return new Response(JSON.stringify({data, status: 200, message: 'Success'}))
}