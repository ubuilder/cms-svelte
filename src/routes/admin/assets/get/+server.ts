import { getAssets } from "$lib/server/index.js";

export async function POST(event) {
  const filters = await event.request.json();
  const db = event.locals.db;

  const assets = await getAssets({ filters, db });

  return new Response(JSON.stringify({ assets }));
}
