function respond(status = 200, message = "", data = {}) {
    const response: any = {}

    response.message = message
    response.status = status
    response.data = data;
    
    
    return new Response(JSON.stringify(response))    
}

export async function GET({request, locals, url}) {
    const user = await locals.api.getUser()
      
    return respond(user.status, user.message, user.data)
} 

export async function POST({request, locals, url}) {
    const body = await request.json();


    const res = await locals.api.updateProfile(body)
    
    return respond(res.status, res.message, res.data)
}