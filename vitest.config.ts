import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'node',
        globals: true,
        testTimeout: 20000,
        include: [
            '**/*.{test,spec}.ts',
        ],
        coverage: {
            provider: 'v8',
            reportsDirectory: path.resolve(__dirname, './coverage'),
        },
    },
})
