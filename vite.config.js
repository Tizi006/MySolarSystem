import { defineConfig } from 'vite'

export default defineConfig({
    base: "/",
    server: {
        host: '0.0.0.0',
        port: 80,
        strictPort: true
    }
})