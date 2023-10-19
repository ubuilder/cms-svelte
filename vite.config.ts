import { sourcemapExclude } from './sourcemapExclude'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit(), sourcemapExclude({ excludeNodeModules: true })],
})
