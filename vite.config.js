import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detectar nombre de repo en CI (GITHUB_REPOSITORY) y permitir override por env.
// Local: base '/'. En GitHub Pages (project page): '/<repo>/'
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''
const envBase = process.env.VITE_BASE_PATH // opcional override
const computedBase = envBase ?? (repo ? `/${repo}/` : '/')

export default defineConfig({
  plugins: [react()],
  base: computedBase,
})