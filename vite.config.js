import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
    // console.log(mode)
    // console.log(loadEnv(mode, process.cwd()).VITE_TEST)
    // console.log(loadEnv(mode, process.cwd()).VITE_BASE_URL)
    return defineConfig({
        base: loadEnv(mode, process.cwd()).VITE_BASE_URL,
        plugins: [vue()],
        resolve: {
            alias: {
                // 添加一个别名 "@" 指向 "src" 目录
                '@': path.resolve(__dirname, 'src'),
                // 你可以根据需要添加更多别名
            },
        },
    })
}
