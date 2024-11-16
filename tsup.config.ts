import { defineConfig } from 'tsup'

export default defineConfig({
    platform: 'node', // 目标平台
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outExtension({ format }) {
        switch (format) {
            case 'cjs':
                return {
                    js: '.cjs',
                    dts: '.d.ts',
                }
            case 'esm':
                return {
                    js: '.mjs',
                    dts: '.d.ts',
                }
            case 'iife':
                return {
                    js: '.global.js',
                    dts: '.d.ts',
                }
            default:
                break
        }
        return {
            js: '.js',
            dts: '.d.ts',
        }
    },
    splitting: false, // 代码拆分
    sourcemap: true,
    clean: true,
    dts: true,
    minify: false, // 缩小输出
    shims: true, // 注入 cjs 和 esm 填充代码，解决 import.meta.url 和 __dirname 的兼容问题
    esbuildOptions(options, context) { // 设置编码格式
        options.charset = 'utf8'
    },
    // external: [], // 排除的依赖项
    // noExternal: [/(.*)/], // 将依赖打包到一个文件中
    // bundle: true,
})
