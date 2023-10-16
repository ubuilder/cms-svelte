export const trailingSlash = 'always';

const show_auth_warning = true;

export async function load({request, locals}) {
    console.log('in layou load')

    console.log("user: ", locals.user)
    const apps = [
        {
            id: "xvsawe",
            slug: "test-api",
            repo: "ubuilder/cms-app-test-api",
            url: "https://cms-app-test-api.hadiahmadi.dev",
            // url: "http://localhost:5174",
            name: "Test API",
            icon: "test",
          },
          {
            id: "xvsaw234",
            slug: "file-manager",
            repo: "ubuilder/file-manager",
            url: "https://cms-app-file-manager.hadiahmadi.dev/assets",
            // url: "http://localhost:5175",
            name: "File Manager",
            icon: "folder",
          },
    ]

    return {
        show_auth_warning: request.headers.get('host')?.includes('localhost') && show_auth_warning,
        user: locals.user,
        lang: 'en',
        dir: 'ltr',
        theme: 'dark',
        siteId: locals.siteId,
        apps
    }
}