// import fetch from "node-fetch";
import type { User } from '../../app'
import type { DbTable, DbList, Page, Table } from '$lib/types'
import { goto } from '$app/navigation'
import type { Component } from '$lib/ui'
import axios from 'axios'

type ApiResponse<T = any> = {
	status: number
	message: string
	field?: string
	data?: T
}

type LoginResponseType = { token: string; user: User }

export function cms_api(
	{ baseUrl, token }: { baseUrl?: string; fetch?: any; token?: string } = {
		token: '',
		baseUrl: 'http://localhost:5173/api',
	}
) {
	async function call<T>(route: string, data: any = {}): Promise<ApiResponse<T>> {
		// TODO: {data} vs data

		const url = baseUrl + route
		const body = data
		const headers: Record<string, any> = {
			'content-type': 'application/json',
		}

		if (token && token !== 'undefined') {
			headers['Authorization'] = `bearer ${token}`
		}

		console.log('[fetch]: ', url)
		// console.log(body)
		// console.log({ headers })

		try {
			// const res: ApiResponse<T> = await fetch(url, { method: 'POST', body, headers }).then((x) =>
			// 	x.json()
			// )

			const res = await axios.post<ApiResponse<T>>(url, body, {headers}).then(x => x.data)
			if (res.status == 401) {
				//
				await goto('/auth/login')

				return {
					status: 401,
					field: res.field,
					message: res.message,
				}
			}

			console.log(`[${res.status}]: ${res.message}.`)
			// console.log(res.data)

			return res
		} catch (err: any) {
			console.log(err.message)
			console.log(err)
			return {
				status: 500,
				message: err.message,
			}
		}
	}

	return {
		async login({ username, password }: any) {
			const result = await call<LoginResponseType>('/auth/login', {
				username,
				password,
			})
			if (result.data) {
				token = result.data.token
			}
			return result
		},
		async register({ username, password, name, email }: any) {
			await call('/auth/register', { username, password, name, email })

			return this.login({ username, password })
		},
		async logout() {
			const result = await call('/auth/logout')
			// token = result.data.token
			token = ''
			return result
		},

		async getUser() {
			const res = await call<User>('/auth/getUser')
			return res
		},
		async updateProfile(params: any) {
			const res = await call<any>('/auth/updateProfile', params)
			return res
		},
		async hasUser() {
			const res = await call<boolean>('/auth/hasUser')
			return res
		},
		async getPages(filters = {}) {
			return call<DbList<Page>>('/pages/getPages', filters)
		},
		async getPageCss({ page_id }: any = {}) {
			return call<string>('/pages/getPageCss', { page_id })
		},
		async getSettings() {
			return call<any>('/settings/getSettings')
		},
		async setSettings(settings: any) {
			return call<any>('/settings/setSettings', settings)
		},
		async createPage({ title, slug }: any) {
			return call('/pages/createPage', { title, slug })
		},
		async getPage(id: string) {
			return call<DbList<Page>>('/pages/getPages', { where: { id } }).then(
				(res) => ({...res, data: res.data!.data[0]})
			)
		},
		async updatePage({ id, data }: any) {
			return call<any>('/pages/updatePage', { id, data })
		},
		async removePage(id: string) {
			return call<any>('/pages/removePage', { id })
		},
		async createTable({ name, icon, fields = [] }: Partial<Table>) {
			return call<any>('/content/createTable', { name, icon, fields })
		},
		async updateTable({ id, data }: { id: string; data: Partial<Table> }) {
			return call<any>('/content/updateTable', { id, data })
		},
		async getTables(filters = {}) {
			return call<DbList<Table>>('/content/getTables', filters)
		},
		async getTableBySlug(slug: string) {
			return call<DbList<Table>>('/content/getTables', {
				where: { slug },
			}).then((res) => ({...res, data: res.data!.data[0]}))
		},

		async getTable(id: string) {
			return call<DbList<Table>>('/content/getTables', { where: { id } }).then(
				(res) => ({...res, data: res.data!.data[0]})
			)
		},
		async removeTable(id: string) {
			return call<any>('/content/removeTable', { id })
		},
		async getComponents(params: any): Promise<Component> {
			return call<any>('/components/getComponents', params)
		},
		async createComponent(component: Partial<Component>): Promise<Component> {
			return call<any>('/components/createComponent', component)
		},
		async updateComponent(id: string, component: Partial<Component>): Promise<Component> {
			return call<any>('/components/updateComponent', {
				id,
				data: component,
			})
		},
		async removeComponent(id: string): Promise<Component> {
			console.log('removeComponent', id)
			return call<any>('/components/removeComponent', { id })
		},
		async getComponent(id: string): Promise<Component> {
			return call<any>('/components/getComponents', { where: { id } }).then(
				(res) => res.data.data[0]
			)
		},
		async insertData(params: any) {
			return call<any>('/data/insertData', params)
		},
		async updateData(params: any) {
			return call<any>('/data/updateData', params)
		},
		async removeData(params: any) {
			return call<any>('/data/removeData', params)
		},
		async getData(params: any) {
			return call<DbList<DbTable>>('/data/getData', params)
		},
		async recoverData(table: string, history_id: string) {
			return call<boolean>('/data/recoverData', { table, history_id })
		},
		async getDataHistory(params: any) {
			return call('/data/getDataHistory', params)
		},
		async getForms(page: string) {
			return call('/form/getForms', {page})
		},
		async submitForm(page: string, pathname: string,  data: any) {
			return call('/form/submitForm', {page, pathname, data})
		},





		async getAssets(params: any) {
			return call<DbList<any>>('/assets/getFiles', params)
		},
		async removeAsset(id: string) {
			return call<any>('/assets/removeFile', { id })
		},
		async updateAsset(id: string, data: any) {
			return call<any>('/assets/updateFile', { id, data })
		},
		async uploadFile(body: FormData) {
			console.log('inside api', baseUrl + '/assets/uploadFile', token)
			const res = await fetch(baseUrl + '/assets/uploadFile', {
				method: 'POST',
				headers: {
					authorization: `bearer ${token}`,
				},
				body,
			}).then(res => res.json())

			return res
			// return (await res.json()).data;
		},
		async downloadFile(id: string) {
			return fetch(baseUrl + '/files/' + id, {
				headers: {
					authorization: 'bearer ' + token,
				},
			})
		},
	}
}
