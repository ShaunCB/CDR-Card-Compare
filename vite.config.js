import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'



// https://vitejs.dev/config/
export default defineConfig({
  base: '/OpenCard-AU/',
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
