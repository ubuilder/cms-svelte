export async function load({params}) {
    const apps = {
        test: {
            name: 'Test',
            icon: 'star',
            url: 'http://localhost:5175'
        },
        pages: {
            name: 'Pages',
            icon: 'page',
            url: 'http://localhost:5176'
        }
    }
    return {
        app: apps[params.name],
        slug: params.slug
    }
}