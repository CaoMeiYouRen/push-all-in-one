import { isNil } from './helper'
import { Config, ConfigSchema } from '@/interfaces/schema'

export function validate<T = Config>(config: T, schema: ConfigSchema<T>): void {
    Object.keys(schema).forEach((key) => {
        const item = schema[key]
        const value = config[key]
        if (!item.required && isNil(value)) {
            return
        }
        if (item.required && isNil(value)) {
            throw new Error(`"${key}" 字段是必须的！`)
        }
        if (item.type === 'select') {
            const { options } = item as any
            if (!options.map((e) => e.value).includes(value)) {
                throw new Error(`"${key}" 字段必须是以下选项之一：${options.map((e) => e.value).join(',')}`)
            }
        } else if (item.type === 'string') {
            if (typeof value !== 'string') {
                throw new Error(`"${key}" 字段必须是字符串！`)
            }

        } else if (item.type === 'number') {
            if (typeof value !== 'number') {
                throw new Error(`"${key}" 字段必须是数字！`)
            }

        } else if (item.type === 'boolean') {
            if (typeof value !== 'boolean') {
                throw new Error(`"${key}" 字段必须是布尔值！`)
            }

        } else if (item.type === 'array') {
            if (!Array.isArray(value)) {
                throw new Error(`"${key}" 字段必须是数组！`)
            }

        } else if (item.type === 'object') {
            if (typeof value !== 'object') {
                throw new Error(`"${key}" 字段必须是对象！`)
            }
        }
    })
}
