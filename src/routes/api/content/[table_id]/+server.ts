import { respond } from '$lib/helpers/api.js';


export async function GET({request, locals, url, params}) {

    if(url.searchParams.get('id')) {
        const id = url.searchParams.get('id');
        const res = await locals.api.getData({table: params.table_id, where: {id}});

        return respond(res.status, res.message, res.data)
    }


    const datas = await locals.api.getData({table: params.table_id, where: locals.filters, perPage: 100})
    console.log(datas)

    return respond(datas.status, datas.message, datas.data)
} 

export async function POST({request, locals, url, params}) {
    const body = await request.json();


    if(url.searchParams.get('id')) {
        const id = url.searchParams.get('id');
        const res = await locals.api.updateData({data: body, table: params.table_id, id});

        return respond(res.status, res.message, res.data)
    }

    const res = await locals.api.insertData({table: params.table_id, data: body})
    
    return respond(res.status, res.message, res.data)
}