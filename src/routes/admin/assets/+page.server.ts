import { fail } from "@sveltejs/kit";
import { join } from "path";
import { rm, writeFile } from "fs/promises";

export async function load({ locals }) {
  const assets = locals
    .db("files")
    .query({ perPage: 50, where: locals.filters })
    .then((res: any) => res.data);

  return {
    assets,
  };
}

export const actions = {
  upload: async ({ request, locals, ...rest }) => {
    const formData = Object.fromEntries(await request.formData());

    if (
      !(formData.file as File).name ||
      (formData.file as File).name === "undefined"
    ) {
      return fail(400, {
        error: true,
        message: "You must provide a file to upload",
      });
    }

    const { file } = formData as { file: File };

    const [fileId] = await locals.db("files").insert({
      name: file.name,
      type: file.type.split("/")[0],
      size: file.size,
      alt: "",
      description: "",
    });

    const filePath = join("data", locals.siteId, "assets", fileId);

    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    return { success: true };
  },
  async remove(event) {
    const body = await event.request.json();

    const id = body.id;

    await event.locals.db("files").remove(id);

    await rm(join("data", event.locals.siteId, "assets", id));

    return { success: true };
  },
  async update(event) {
    const body = await event.request.json();

    const id = body.id;
    const data = body.data;

    await event.locals.db("files").update(id, {
      name: data.name,
      alt: data.alt,
      description: data.description,
    });

    return { success: true };
  },
};
