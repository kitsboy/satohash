import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // The default 5 s per-test budget is too tight for this suite: jsdom environment
    // set-up dominates (observed ~450 s across 39 files on a loaded box), so a test that
    // passes in isolation in ~1.7 s can exceed 5 s and fail the gate intermittently
    // (`src/pages/Access.test.jsx` timed out under load on 2026-09-13 while passing alone).
    // Raising the budget does not hide a failing assertion — it stops counting a starved
    // worker as a failure. The set-up cost itself is tracked separately.
    testTimeout: 30000,
    hookTimeout: 30000,
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'server/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    environmentMatchGlobs: [['server/**/*.test.js', 'node']],
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 22,
        functions: 22,
        branches: 20,
        statements: 22
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
