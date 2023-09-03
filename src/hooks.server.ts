import { connect } from "@ulibs/db";
import qs from "qs";

const enable_test_user = true;

export const handle = async ({ event, resolve }) => {
  const sitesDb = connect({ filename: "data/db.json" });
  const sites = await sitesDb.getModel("sites").query();

  let siteId;

  for (let site of sites.data) {
    if (
      event.request.headers.get("host") &&
      site.domains.includes(event.request.headers.get("host"))
    ) {
      siteId = site.id;
    }
  }

  if (!siteId && event.request.headers.get("host")?.includes("localhost")) {
    siteId = event.url.port;
  }
  if (!siteId) throw new Error("Site not found");

  // get model based on domain
  const { getModel } = connect({ filename: "data/" + siteId + "/db.json" }); // based on url
  event.locals.db = (table: string) => getModel(table);


  console.log(event.cookies.getAll())

  if (event.cookies.get("auth")) {
    const user = event.locals
      .db("u-users")
      .get({ where: { id: event.cookies.get("auth") } });

    event.locals.user = user;
  }

  if(!event.locals.user && event.request.headers.get('host')?.includes('localhost') && enable_test_user) {
    event.locals.user = {
      id: '123',
      name: 'Default',
      email: 'default@gmail.com',
      username: 'default',
      profile: '',
      password: '123_hashed'
    }
  }

  event.locals.siteId = siteId;

  if (event.request.method === "GET") {
    const obj = qs.parse(event.url.search.substring(1));

    event.locals.filters = obj.filters;
  }

  return resolve(event);
};
