import type { DbFilter } from "$lib/types";
import type { AssetType } from "$lib/types/asset";

export async function getAssets({ filters, api }: {filters: DbFilter, api: any}): Promise<AssetType[]> {
  // return api<AssetType>("u-files")
  //   .query({ perPage: 50, where: filters })
  //   .then((res: any) => res.data);

  return []
  
}
