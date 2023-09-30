export async function POST(event:any){
    const body = await event.request.json();

    if(event.params.slug === "create"){
        const data = body.data;
        const table = body.table;

        await event.locals.db(table).insert(data)
    }
    else if(event.params.slug === "remove"){
        const data = body.data;
        const table = body.table;
        
        await event.locals.db(table).remove(data.id)
    }
    
    console.log("action called: ", event.params.slug, body);
    return new Response(JSON.stringify({success: true, body, action: event.params.slug}))    
}