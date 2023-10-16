export async function load({locals}) {
    const filters = locals.filters
    console.log({filters})
    const apps = [
        {
            id: "xvsawe",
            slug: "test-api",
            repo: "ubuilder/cms-app-test-api",
            // url: "https://cms-app-test-api.hadiahmadi.dev",
            url: "http://localhost:5174",
            name: "Test API",
            icon: "test",
          },
          {
            id: "xvsaw234",
            slug: "file-manager",
            repo: "ubuilder/file-manager",
            // url: "https://cms-app-file-manager.hadiahmadi.dev",
            url: "http://localhost:5175",
            name: "File Manager",
            icon: "folder",
          },
    ]
    
    return {
        apps
    }
}