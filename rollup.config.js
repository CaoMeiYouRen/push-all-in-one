import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import analyzer from 'rollup-plugin-analyzer'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import _ from 'lodash'
import { dependencies, name } from './package.json'
const external = Object.keys(dependencies) // 默认不打包 dependencies
const outputName = _.upperFirst(_.camelCase(name))// 导出的模块名称 PascalCase
const env = process.env
// const __PROD__ = env.NODE_ENV === 'production'
// const __DEV__ = env.NODE_ENV === 'development'
const __ANALYZER__ = Boolean(env.ANALYZER)
function getPlugins({ isBrowser = false, isMin = false, isDeclaration = false }) {
    const plugins = []
    plugins.push(
        nodeResolve({
            browser: isBrowser,
            preferBuiltins: true,
        }),
    )
    plugins.push(
        typescript({
            tsconfig: 'tsconfig.json',
            module: 'esnext',
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            declaration: isDeclaration,
            sourceMap: true,
        }),
    )
    plugins.push(alias({
        entries: [
            { find: '@', replacement: path.resolve(__dirname, '../src') },
        ],
    }))
    plugins.push(
        commonjs({
            sourceMap: false,
        }),
    )
    plugins.push(
        json({}),
    )
    plugins.push(
        replace({
            exclude: 'node_modules/**',
            'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'production'),
            preventAssignment: false,
        }),
    )
    if (isMin) {
        plugins.push(
            terser({
                module: true,
            }),
        )
    }
    if (__ANALYZER__) {
        plugins.push(
            analyzer({

            }),
        )
    }
    return plugins
}

export default [
    {
        input: 'src/index.ts', // 生成类型文件
        external,
        output: {
            dir: 'dist',
            format: 'esm',
            name: outputName,
        },
        plugins: getPlugins({
            isBrowser: false,
            isDeclaration: true,
            isMin: false,
        }),
    },
    {
        input: 'src/index.ts',
        external,
        output: {
            file: 'dist/index.js', // 生成 cjs
            format: 'cjs',
            name: outputName,
            sourcemap: true,
        },
        plugins: getPlugins({
            isBrowser: false,
            isDeclaration: false,
            isMin: false,
        }),
    },
    {
        input: 'src/index.ts',
        external,
        output: {
            file: 'dist/index.umd.js', // 生成 umd
            format: 'umd',
            name: outputName,
            sourcemap: true,
        },
        plugins: getPlugins({
            isBrowser: false,
            isDeclaration: false,
            isMin: false,
        }),
    },
    {
        input: 'src/index.ts',
        external,
        output: {
            file: 'dist/index.esm.js', // 生成 esm
            format: 'esm',
            name: outputName,
            sourcemap: true,
        },
        plugins: getPlugins({
            isBrowser: false,
            isDeclaration: false,
            isMin: false,
        }),
    },
    // { // 本包不推荐在浏览器中使用，故不生成浏览器版本
    //     input: 'src/index.ts',
    //     external,
    //     output: {
    //         file: 'dist/index.browser.js', // 生成 browser
    //         format: 'umd',
    //         name: outputName,
    //         sourcemap: true,
    //     },
    //     plugins: getPlugins({
    //         isBrowser: true,
    //         isDeclaration: false,
    //         isMin: true,
    //     }),
    // },
]
