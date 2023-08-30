export async function load({url}) {

    const item = url.searchParams.get('item') ?? 0


    return {
        item
    }
}