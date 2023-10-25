import { readFile } from 'fs/promises'
import { join } from 'path'

/*
event:  {
  cookies: {
    get: [Function: get],
    getAll: [Function: getAll],
    set: [Function: set],
    delete: [Function: delete],
    serialize: [Function: serialize]
  },
  fetch: [AsyncFunction (anonymous)],
  getClientAddress: [Function: getClientAddress],
  locals: { db: [Function (anonymous)], siteId: '123123' },
  params: { id: 'uTVGnrjX' },
  platform: undefined,
  request: Request {
    [Symbol(realm)]: { settingsObject: [Object] },
    [Symbol(state)]: {
      method: 'GET',
      localURLsOnly: false,
      unsafeRequest: false,
      body: null,
      client: [Object],
      reservedClient: null,
      replacesClientId: '',
      window: 'client',
      keepalive: false,
      serviceWorkers: 'all',
      initiator: '',
      destination: '',
      priority: null,
      origin: 'client',
      policyContainer: 'client',
      referrer: 'client',
      referrerPolicy: '',
      mode: 'cors',
      useCORSPreflightFlag: false,
      credentials: 'same-origin',
      useCredentials: false,
      cache: 'default',
      redirect: 'follow',
      integrity: '',
      cryptoGraphicsNonceMetadata: '',
      parserMetadata: '',
      reloadNavigation: false,
      historyNavigation: false,
      userActivation: false,
      taintedOrigin: false,
      redirectCount: 0,
      responseTainting: 'basic',
      preventNoCacheCacheControlHeaderModification: false,
      done: false,
      timingAllowFailed: false,
      headersList: [HeadersList],
      urlList: [Array],
      url: URL {}
    },
    [Symbol(signal)]: AbortSignal { aborted: false },
    [Symbol(headers)]: HeadersList {
      cookies: null,
      [Symbol(headers map)]: [Map],
      [Symbol(headers map sorted)]: null
    }
  },
  route: { id: '/files/[id]' },
  setHeaders: [Function: setHeaders],
  url: URL {
    href: 'http://localhost:5173/files/uTVGnrjX',
    origin: 'http://localhost:5173',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:5173',
    hostname: 'localhost',
    port: '5173',
    pathname: '/files/uTVGnrjX',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
  },
  isDataRequest: false,
  isSubRequest: false
}

*/
export async function GET(event) {
	// console.log('event: ', event)

	// const response = await event.locals.api.downloadFile(event.params.id)

  return fetch(event.locals.baseUrl + '/files/' + event.params.id, {headers: {authorization: 'bearer ' + event.locals.token}})
  // console.log(response)
	// return response
	// const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
	// while (true) {
	//   const { value, done } = await reader.read();
	//   console.log("resp", done, value);
	//   if (done) break;
	//   result += `${value}<br>`;
	// }
	// // const file = await readFile(join('data', event.locals.siteId, 'assets', event.params.id))

	// return new Response("file content stream from server...")
}
