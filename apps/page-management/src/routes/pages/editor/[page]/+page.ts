export const ssr = false
export function load({data}){
    return{
        page: data.page
    }
}