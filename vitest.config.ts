import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  envPrefix: ['VITE', 'NEXT'],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['./**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: [],
    css: true,
    testTimeout: 30_000,
    retry: 0,
    globalSetup: ['./test/anvil/anvil-global-setup.ts'],
  },
})
