export async function POST(event:any){
    console.log("action called: ", event.params.slug);
    return new Response(JSON.stringify({success: true}))    
}