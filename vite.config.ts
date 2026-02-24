import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'

const isElectron = process.env.ELECTRON === 'true'

export default defineConfig({
    base: './',
    plugins: [
        react(),
        isElectron && electron([
            {
                entry: 'electron/main.ts',
            },
            {
                entry: 'electron/preload.ts',
                onstart(options) {
                    options.reload()
                },
            },
        ]),
        isElectron && renderer(),
    ].filter(Boolean),
})
