import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/doudou/',
    plugins: [vue()],
    resolve: {
        alias: {
            // 添加一个别名 "@" 指向 "src" 目录
            '@': path.resolve(__dirname, 'src'),
            // 你可以根据需要添加更多别名
        },
    },
})
