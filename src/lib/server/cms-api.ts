export function cms_api({baseUrl, fetch, token}: {baseUrl?: string, fetch?: any, token: string} = {token: '', baseUrl: 'http://localhost:5173/api'}) {
    async function call(route: string, data = {}) {
      // TODO: {data} vs data
      console.log('calling: ', {baseUrl, route, data})
      console.log('calling fetch ', baseUrl + route, 'body: ', JSON.stringify({data}))
      const res = await fetch(baseUrl + route, {method: 'POST', body: JSON.stringify(data), headers: {
        "content-type": 'application/json',
        'Authorization': `bearer ${token}`
      }}).then(res => res.json());
  
      console.log(`[${res.status}]: ${res.message}.`);
  
      return res ?? {};
    }
    
    return {
      async login({username, password}: any) {
        const result = await call('/auth/login', {username, password})
        if(result.data) {
          token = result.data.token
        }
        return result;
      },
      async register({username, password, name, email}: any) {
        await call('/auth/register', {username, password, name, email})
        const result = await call('/auth/login', {username, password})
        
        token = result.data?.token
        return result
      },
      async logout() {
        const result = await call('/auth/logout')
        // token = result.data.token
        token = ''
        return result;
      },
      
      async getUser() {
        return call('/auth/getUser');
      },
      async getPages(filters = {}) {
        return call('/pages/getPages', filters)
      },
      async getPage(id: string) {
        return call('/pages/getPages', {where: {id}}).then(res => res.data[0]);
      },
      async getTables(filters = {}) {
        return call('/content/getTables', filters)
      },
      async getTable(id: string) {
        return call('/content/getTables', {where: {id}}).then(res => res.data[0])
      }
    }
  }