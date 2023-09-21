export async function POST(event:any){
    const body = event.request.json();
    console.log("action called: ", event.params.slug, body);
    return new Response(JSON.stringify({success: true, body, action: event.params.slug}))    
}