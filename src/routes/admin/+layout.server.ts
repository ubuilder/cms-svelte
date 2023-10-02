const show_auth_warning = true;

export async function load({request, locals}) {
    console.log('in layou load')

    console.log(locals)

    return {
        show_auth_warning: request.headers.get('host')?.includes('localhost') && show_auth_warning,
        user: locals.user
    }
}