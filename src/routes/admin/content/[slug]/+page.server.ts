import type { Db, DbTable, Table } from "$lib/types";
import { error, type ServerLoad } from "@sveltejs/kit";

import type { Actions } from "./$types";

async function preparePayload({
  db,
  params,
  body,
  id = undefined,
  afterInsert,
  mode = "insert",
}: {
  db: Db;
  params: Record<string, string>;
  afterInsert?: any;
  mode: "update" | "insert";
  id?: string;
  body: any;
}) {
  const table = await db<Table>("u-tables").get({
    where: { slug: params.slug },
  });

  const payload: any = {};

  for (let field of table.fields) {
    // check required only on insert
    if (mode === "insert" && field.required) {
      if (!body[field.name]) {
        throw error(400, `the "${field.name}" field is required`);
      }
    }

    // number validation
    if (body[field.name] && field.type === "number") {
      if (isNaN(Number(body[field.name]))) {
        throw error(400, `the "${field.name}" field should be a number`);
      } else {
        body[field.name] = +body[field.name];
      }

      if (typeof field.min !== undefined && field.min > body[field.name]) {
        throw error(
          400,
          `the "${field.name}" field should be larger than ${field.min}`
        );
      }
      if (typeof field.max !== undefined && field.max < body[field.name]) {
        throw error(
          400,
          `the "${field.name}" field should be smaller than ${field.min}`
        );
      }
      if (field.negative && 0 < body[field.name]) {
        throw error(400, `the "${field.name}" field should not be negative`);
      }
    }

    if (body[field.name] && field.type === "relation") {
      if (field.multiple) {
        // user.posts
        // update other table
        const otherTable = await db<Table>("u-tables").get({
          where: { slug: field.table },
        });
        const otherField = otherTable.fields.find(
          (x) => x.type === "relation" && x.name === field.field
        );

        if (otherField) {
          // update other table
          if (mode === "insert") {
            afterInsert(async (id: string) => {
              console.log(
                "after insert: id: ",
                id,
                "body field name: ",
                body[field.name]
              );
              for (let otherId of body[field.name]) {
                await db(otherTable.slug).update(otherId, {
                  [field.field + "_id"]: id, // id of new inserted item
                });
              }
            });
          } else {
            console.log(
              `[${mode} - ${id}] set `,
              field.field + "_id",
              "of ",
              otherTable.slug,
              " to " + id,
              "where there ids are",
              body[field.name]
            );
            for (let otherId of body[field.name]) {
              await db(otherTable.slug).update(otherId, {
                [field.field + "_id"]: id, // id of new inserted item
              });
            }
          }
        } else {
          throw error(
            400,
            "this relation field is not connected to other table 1.."
          );

          // not connected
        }
      } else {
        // blog.author
        const otherTable = await db<Table>("u-tables").get({
          where: { slug: field.table },
        });
        const otherField = otherTable.fields.find(
          (x) =>
            x.type === "relation"
            // x.table === params.slug &&
            // x.multiple
            // x.field === field.name
        );

        if (otherField) {
          payload[field.name + "_id"] = body[field.name];
        } else {
          // not connected
          throw error(
            400,
            "this relation field is not connected to other table.."
          );
        }
      }
    } else {
      payload[field.name] = body[field.name];
    }
  }
  return payload;
}

export const actions: Actions = {
  async insert({ request, locals, params }) {
    let afterInsertFn: any = undefined;
    function afterInsert(callback: (id: string) => Promise<void>) {
      afterInsertFn = callback;
    }

    const body = await request.json();

    const payload: any = await preparePayload({
      body,
      params,
      db: locals.db,
      afterInsert,
      mode: "insert",
    });

    const ids = await locals.db(params.slug).insert(payload);

    if (afterInsertFn) {
      await afterInsertFn(ids[0]);
    }

    return { success: true };
  },
  async update({ request, locals, params }) {
    const body = await request.json();

    const { id, ...fields } = body;

    const payload = await preparePayload({
      db: locals.db,
      id,
      params,
      body: fields,
      mode: "update",
      afterInsert: () => {},
    });
    await locals.db(params.slug).update(id, payload);

    return { success: true };
  },
  async remove({ request, locals, params }) {
    const body = await request.json();

    await locals.db(params.slug).remove(body.id);

    return { success: true };
  },
};
