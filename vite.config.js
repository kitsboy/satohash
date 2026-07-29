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
        // Put CSS <link> before module <script> so the cascade isn't delayed (FOUC / "missing CSS")
        {
            name: 'stylesheet-before-modules',
            transformIndexHtml: {
                order: 'post',
                handler(html) {
                    const links = []
                    let out = html.replace(
                        /<link[^>]+rel=["']stylesheet["'][^>]*>\s*/gi,
                        (m) => {
                            links.push(m.trim())
                            return ''
                        }
                    )
                    if (!links.length) return html
                    // Insert just before the first module script
                    return out.replace(
                        /<script[^>]+type=["']module["'][^>]*>/,
                        `${links.join('\n    ')}\n    $&`
                    )
                }
            }
        },
        // EMERGENCY: self-destroying SW kills every old registration on next visit.
        // Stops System Desync (HTML served as JS via stale SW). Re-enable full PWA later.
        VitePWA({
            registerType: 'autoUpdate',
            selfDestroying: true,
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true
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
