import fetch from "node-fetch";
import type { User } from "../../app";
import type { DbQuery, Page, Table } from "$lib/types";

type ApiResponse<T = any> = {
  status: number;
  message: string;
  data?: T;
};

type LoginResponseType = {token: string, user: User}


export function cms_api(
  {
    baseUrl,
    // fetch,
    token,
  }: { baseUrl?: string; fetch?: any; token?: string } = {
    token: "",
    baseUrl: "http://localhost:5173/api",
  }
) {
  async function call<T>(route: string, data = {}) {
    // TODO: {data} vs data

    const url = baseUrl + route;
    const body = JSON.stringify(data);
    const headers: Record<string, any> = {
      "content-type": "application/json",
    };

    if (token && token !== "undefined") {
      headers["Authorization"] = `bearer ${token}`;
    }

    console.log("calling fetch ", url, "body: ", body, "headers: ", headers);

    try {
      const res = (await fetch(url, {
        method: "POST",
        body,
        headers,
      }).then((res) => res.json())) as ApiResponse<T>;

      console.log(`[${res.status}]: ${res.message}.`);

      return res ?? {};
    } catch (err: any) {
      console.log(err.message);
      console.log(err);
      return {
        status: 500,
        message: err.message,
        data: null
      }
    }
  }

  return {
    async login({ username, password }: any) {
      const result = await call<LoginResponseType>("/auth/login", { username, password });
      if (result.data) {
        token = result.data.token;
      }
      return result;
    },
    async register({ username, password, name, email }: any) {
      await call("/auth/register", { username, password, name, email });
      const result = await call<LoginResponseType>("/auth/login", { username, password });

      token = result.data?.token;
      return result;
    },
    async logout() {
      const result = await call("/auth/logout");
      // token = result.data.token
      token = "";
      return result;
    },

    async getUser() {
      const res = await call<User>("/auth/getUser");
      console.log("after get User", res);
      return res;
    },
    async getPages(filters = {}) {
      return call<DbQuery<Page>>("/pages/getPages", filters);
    },
    async createPage({ title, slug }: any) {
      return call("/pages/createPage", { title, slug });
    },
    async getPage(id: string) {
      return call<DbQuery<Page>>("/pages/getPages", { where: { id } }).then(
        (res) => res.data.data[0]
      );
    },
    async updatePage({id, data}: any) {
      return call<any>("/pages/updatePage", {id, data}).then(res => res.data)
    },
    async removePage(id: string) {
      return call<any>("/pages/removePage", {id}).then(res => res.data)

    },
    async getTables(filters = {}) {
      return call<DbQuery<Table>>("/content/getTables", filters);
    },
    async getTable(id: string): Promise<Table> {
      return call<DbQuery<Table>>("/content/getTables", { where: { id } }).then(
        (res) => res.data[0]
      );
    },
  };
}
