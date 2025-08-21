// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import cmyr from 'eslint-config-cmyr'

export default defineConfig([
    cmyr,
    {
        rules: {
            // 保留原有的自定义规则
            'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
            '@typescript-eslint/explicit-module-boundary-types': [1, {
                allowArgumentsExplicitlyTypedAsAny: true,
            }], // 要求导出函数和类的公共类方法的显式返回和参数类型
            'require-await': 0,
            '@stylistic/padded-blocks': [1, { blocks: 'never', classes: 'always', switches: 'never' }], // 强制在代码块中保持一致的空行填充
        },
    },
])
