import { isEmpty } from './helper'
import { Config, ConfigSchema } from '@/interfaces/schema'

/**
 * 验证配置是否符合 Schema 规则，如果不符合则抛出错误
 *
 * @author CaoMeiYouRen
 * @date 2024-11-17
 * @export
 * @template T
 * @param config
 * @param schema
 */
export function validate<T = Config>(config: T, schema: ConfigSchema<T>): void {
    Object.keys(schema).forEach((key) => {
        const item = schema[key]
        const value = config[key]
        if (!item.required && isEmpty(value)) {
            return
        }
        if (item.required && isEmpty(value)) {
            throw new Error(`"${key}" 字段是必须的！`)
        }
        if (item.type === 'select') {
            const { options } = item as any
            if (!options.map((e) => e.value).includes(value)) {
                throw new Error(`"${key}" 字段必须是以下选项之一：${options.map((e) => e.value).join(',')}`)
            }
            return
        }
        if (item.type === 'string') {
            if (typeof value !== 'string') {
                throw new Error(`"${key}" 字段必须是字符串！`)
            }
            return
        }
        if (item.type === 'number') {
            if (typeof value !== 'number') {
                throw new Error(`"${key}" 字段必须是数字！`)
            }
            return
        }
        if (item.type === 'boolean') {
            if (typeof value !== 'boolean') {
                throw new Error(`"${key}" 字段必须是布尔值！`)
            }
            return
        }
        if (item.type === 'array') {
            if (!Array.isArray(value)) {
                throw new Error(`"${key}" 字段必须是数组！`)
            }
            return
        }
        if (item.type === 'object') {
            if (typeof value !== 'object') {
                throw new Error(`"${key}" 字段必须是对象！`)
            }
            return
        }
        throw new Error(`"${key}" 字段类型不支持！`)
    })
}
