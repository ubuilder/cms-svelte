export async function load({locals}) {


    const components = await locals.api.getComponents({perPage: 500})

    return {
        // charts: await locals.api.getCharts()
        charts: [],
        components
    }
}