import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss' // インポートはそのまま

export default defineConfig({
    plugins: [
        react(),
        // ここから tailwindcss() を削除
    ],
    css: {
        postcss: {
            plugins: [
                tailwindcss(), // ここに移動
            ],
        },
    },
})