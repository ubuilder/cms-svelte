export async function getAssets({ filters, db }: any = {}) {
  return db("u-files")
    .query({ perPage: 50, where: filters })
    .then((res: any) => res.data);
}
