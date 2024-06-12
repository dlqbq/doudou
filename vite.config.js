import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import CopyPlugin from 'vite-plugin-files-copy'

// https://vitejs.dev/config/
export default ({ mode }) => {
    // console.log(mode)
    // console.log(loadEnv(mode, process.cwd()).VITE_TEST)
    // console.log(loadEnv(mode, process.cwd()).VITE_BASE_URL)
    return defineConfig({
        base: loadEnv(mode, process.cwd()).VITE_BASE_URL,
        plugins: [
            vue(),
            CopyPlugin({
                patterns: [
                    {
                        from: 'src/assets', // string 相对项目下相对路径
                        to: 'dist/assets', // string 相对项目下相对路径
                    },
                ],
            }),
        ],
        resolve: {
            alias: {
                // 添加一个别名 "@" 指向 "src" 目录
                '@': path.resolve(__dirname, 'src'),
                // 你可以根据需要添加更多别名
            },
        },
        build: {
            terserOptions: {
                compress: {
                    drop_console: true, // 生产环境移除console
                },
            },
            outDir: 'dist',
            assetsDir: 'assets',
        },
    })
}
