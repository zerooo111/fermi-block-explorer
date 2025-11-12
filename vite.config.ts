import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

// Custom plugin to resolve @ imports from fermi-explorer-fronend
function continuumAliasResolver(): Plugin {
  return {
    name: 'continuum-alias-resolver',
    enforce: 'pre',
    resolveId(source, importer) {
      // Check if the import starts with @/
      if (source.startsWith('@/') && importer) {
        // Normalize paths for cross-platform compatibility
        const normalizedImporter = importer.replace(/\\/g, '/')

        // Check if the importing file is from fermi-explorer-fronend
        if (normalizedImporter.includes('fermi-explorer-fronend')) {
          // Resolve @ to fermi-explorer-fronend/src
          const continuumSrcPath = resolve(__dirname, '../fermi-explorer-fronend/src')
          const resolvedPath = source.replace('@/', continuumSrcPath + '/')
          return resolvedPath
        }
      }
      // Let Vite handle other resolutions (including @ from fermi-block-explorer)
      return null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    continuumAliasResolver(),
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // server: {
  //   port: 3000,
  //   proxy: {
  //     '/status': {
  //       target: 'http://44.194.22.128:8080',
  //       changeOrigin: true,
  //     },
  //     '/blocks': {
  //       target: 'http://44.194.22.128:8080',
  //       changeOrigin: true,
  //     },
  //     '/markets': {
  //       target: 'http://44.194.22.128:8080',
  //       changeOrigin: true,
  //     },
  //     '/transactions': {
  //       target: 'http://44.194.22.128:8080',
  //       changeOrigin: true,
  //     },
  //     '/events': {
  //       target: 'http://44.194.22.128:8080',
  //       changeOrigin: true,
  //     },
  //   },
  // },
})
