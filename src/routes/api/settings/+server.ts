function respond(status = 200, message = "", data = {}) {
    const response: any = {}

    response.message = message
    response.status = status
    response.data = data;
    
    
    return new Response(JSON.stringify(response))    
}

export async function GET({request, locals, url}) {
    const response: any = {}

    const settings = await locals.api.getSettings()
    console.log(settings)

    return respond(settings.status, settings.message, settings.data)
} 

export async function POST({request, locals, url}) {
    const body = await request.formData();

    // upload file
    const res = await locals.api.updateSettings(body);
    
    return respond(res.status, res.message, res.data)
}