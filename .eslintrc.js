// const __ERROR__ = process.env.NODE_ENV === 'production' ? 2 : 0
const __WARN__ = process.env.NODE_ENV === 'production' ? 1 : 0
module.exports = {
    root: true,
    globals: {
        globalThis: true,
    },
    env: {
    },
    settings: {
    },
    extends: [
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'cmyr',
    ],
    plugins: [
        'import',
    ],
    rules: {
        'no-console': __WARN__,
        'no-shadow': 0,
        '@typescript-eslint/no-shadow': 2,
        '@typescript-eslint/explicit-module-boundary-types': [1, {
            allowArgumentsExplicitlyTypedAsAny: true,
        }], // 要求导出函数和类的公共类方法的显式返回和参数类型
        '@typescript-eslint/comma-dangle': [2, 'always-multiline'], // 要求或禁止使用拖尾逗号
        'import/no-unresolved': 0,
        'import/order': 1,
    },
}
