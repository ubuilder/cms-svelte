export const actions = {
    async logout(event) {
        event.cookies.set('auth', '')
        return {success: true}
    }
}