import path from 'path'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
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
                include: [
                    'src/**/*.ts',
                ],
                thresholds: {
                    lines: 90,
                    functions: 90,
                    statements: 90,
                    branches: 80,
                },
            },
            env,
        },
    }
})
