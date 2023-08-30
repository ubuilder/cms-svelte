import { connect } from "@ulibs/db";
import qs from "qs";

import { existsSync, mkdirSync } from "fs";

export const handle = async ({ event, resolve }) => {
  const siteId = "123123";

  // get model based on domain
  const { getModel } = connect({ filename: "data/" + siteId + "/db.json" }); // based on url
  event.locals.db = (table: string) => getModel(table);

  if (!existsSync("data/" + siteId)) {
    mkdirSync("data/" + siteId, { recursive: true });
    mkdirSync("data/" + siteId + "/assets", { recursive: true });
  }

  event.locals.siteId = siteId;

  if (event.request.method === "GET") {
    const obj = qs.parse(event.url.search.substring(1));

    event.locals.filters = obj.filters;
  }

  return resolve(event);
};
