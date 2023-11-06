function respond(status = 200, message = "", data = {}) {
    const response: any = {}

    response.message = message
    response.status = status
    response.data = data;
    
    
    return new Response(JSON.stringify(response))    
}

export async function GET({request, locals, url}) {

    if(url.searchParams.get('id')) {
        const id = url.searchParams.get('id');
        const res = await locals.api.getPage(id);

        return respond(res.status, res.message, res.data)
    }

    const response: any = {}

    const pages = await locals.api.getPages({perPage: 100})
    console.log(pages)

    return respond(pages.status, pages.message, pages.data.data)
} 

export async function POST({request, locals, url}) {
    const body = await request.json();


    if(url.searchParams.get('id')) {
        const id = url.searchParams.get('id');
        const res = await locals.api.updatePage({id, data: body});

        return respond(res.status, res.message, res.data)
    }


    const res = await locals.api.createPage(body)

    return respond(res.status, res.message, res.data)
}

export async function DELETE({request, locals, url}) {
    const body = await request.json()

    const res = await locals.api.removePage(body.id)

    return respond(res.status, res.message, res.data)
}