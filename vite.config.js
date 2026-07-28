import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { readFileSync } from 'fs'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        wasm(),
        topLevelAwait(),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                // Drop old precache entries after deploys (prevents stale chunk → HTML → Unexpected token '<')
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                // Never treat /assets/* as SPA navigations
                navigateFallback: 'index.html',
                navigateFallbackDenylist: [/^\/assets\//, /^\/api\//, /^\/metrics\.json$/, /^\/vendor\//, /^\/sw\.js$/],
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
                globIgnores: ['**/vendor/ots.browser.js'],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        // Network-first for app shell so deploys win over SW cache
                        urlPattern: ({ request, url }) =>
                            request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'html-shell',
                            networkTimeoutSeconds: 5,
                            expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 }
                        }
                    }
                ]
            }
        }),
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 80 },
            webp: { lossless: true },
            svg: { multipass: true }
        }),
        viteCompression({ algorithm: 'brotliCompress' })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000,
        host: true,
        proxy: {
            '/api': 'http://localhost:3001',
            '/socket.io': {
                target: 'http://localhost:3001',
                ws: true
            }
        }
    },
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
        __BUILD_NUMBER__: JSON.stringify(JSON.parse(readFileSync(new URL('./build-metadata.json', import.meta.url), 'utf8')).buildNumber)
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    motion: ['framer-motion'],
                    icons: ['lucide-react'],
                    three: ['three'],
                    crypto: ['bitcoinjs-lib', 'ethers', 'tiny-secp256k1'],
                    utils: ['jspdf'],
                    i18n: ['i18next', 'react-i18next']
                }
            }
        }
    }
})
