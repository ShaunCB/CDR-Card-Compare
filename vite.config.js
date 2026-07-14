import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// Extract homepage path if available
let homepagePath = '/CDR-Card-Compare/'
if (pkg.homepage) {
  try {
    const url = new URL(pkg.homepage)
    homepagePath = url.pathname
  } catch (e) {
    homepagePath = pkg.homepage
  }
}

const publicUrl = process.env.PUBLIC_URL || homepagePath
const base = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        // Only transform .js files in the src directory containing JSX
        if (!id.match(/src\/.*\.js$/)) return null

        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
    react(),
  ],
  base: base,
  server: {
    port: parseInt(process.env.PORT) || 3001,
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
