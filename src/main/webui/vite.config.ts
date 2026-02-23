import {fileURLToPath, URL} from 'node:url'
import UnoCSS from 'unocss/vite'
import {celerixPreset} from 'celerix-spectrum/unoPreset'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        UnoCSS({
            presets: [celerixPreset()],
        }),
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            clientPort: 8080
        }
    }
})
