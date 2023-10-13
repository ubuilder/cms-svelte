export async function load({cookies, params}) {
    const apps = [
        {
            id: "xvsawe",
            slug: 'test-api',
            repo: 'TheHadiAhmadi/cms-app-test-api',
            url: 'http://localhost:5174',
            name: 'Test API',
            icon: 'test'
        }
    ]

    const app = apps.find(x => x.slug === params.slug)

    if(app) {
        try {

        await fetch(app?.url).then(res => {
            console.log(res)
        })

        return {
            token: cookies.get('token'),
            fail: false,
            app
        }
    } catch(err) {
        return {app, fail: true}
    }

    }

    return {}
}