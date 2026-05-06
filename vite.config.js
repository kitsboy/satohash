import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
import { readFileSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({ registerType: 'autoUpdate' }),
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
        __APP_VERSION__: JSON.stringify(pkg.version)
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
                    crypto: ['bitcoinjs-lib', 'ethers', 'tiny-secp256k1']
                }
            }
        }
    }
})
