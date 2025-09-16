import { defineConfig } from 'tsdown'

export default defineConfig({
    platform: 'node', // 目标平台
    entry: ['src/index.ts'],
    outDir: 'dist', // 输出目录
    format: ['cjs', 'esm'],
    fixedExtension: true, // 保持输出文件的扩展名一致
    hash: false, // 不添加哈希到输出文件名
    nodeProtocol: true, // 为内置模块添加 node: 前缀（例如，fs → node:fs）
    sourcemap: true,
    clean: true,
    dts: true,
    minify: false, // 缩小输出
    shims: true, // 注入 cjs 和 esm 填充代码，解决 import.meta.url 和 __dirname 的兼容问题
})
