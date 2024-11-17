import { validate } from './validate'
import { ConfigSchema } from '@/interfaces/schema'

describe('validate', () => {
    type TestConfigSchema = ConfigSchema<{
        name: string
        age?: number
        isActive: boolean
        content?: 'text' | 'html'
        status: 1 | 2 | 3
        settings?: object
        list?: any[]
    }>
    // 定义一个示例配置和对应的 Schema
    const configSchema: TestConfigSchema = {
        name: {
            type: 'string',
            title: 'Name',
            description: 'User name',
            required: true,
        },
        age: {
            type: 'number',
            title: 'Age',
            description: 'User age',
            required: false,
        },
        isActive: {
            type: 'boolean',
            title: 'Active',
            description: 'Is user active',
            required: true,
        },
        content: {
            type: 'select',
            title: 'Content',
            description: 'Content type',
            required: false,
            options: [
                { label: 'Text', value: 'text' },
                { label: 'HTML', value: 'html' },
            ],
        },
        status: {
            type: 'select',
            title: 'Status',
            description: 'User status',
            required: true,
            options: [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
            ],
        },
        settings: {
            type: 'object',
            title: 'Settings',
            description: 'Settings object',
            required: false,
        },
        list: {
            type: 'array',
            title: 'List',
            description: 'List of items',
            required: false,
            default: [],
        },
    }

    // 测试必填字段
    it('should throw an error if a required field is missing', () => {
        const config = {
            age: 25,
            isActive: true,
            content: 'text',
            status: 1,
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).toThrow('"name" 字段是必须的！')
    })

    // 测试非必填字段
    it('should not throw an error if an optional field is missing', () => {
        const config = {
            name: 'John',
            isActive: true,
            status: 1,
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).not.toThrow()
    })

    // 测试字段类型验证
    it('should throw an error if a field type is incorrect', () => {
        const config = {
            name: 'John',
            age: '25', // 应该是 number
            isActive: true,
            status: 1,
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).toThrow('"age" 字段必须是数字！')
    })

    // 测试联合类型验证
    it('should throw an error if a select field value is not in options', () => {
        const config = {
            name: 'John',
            age: 25,
            isActive: true,
            content: 'xml', // 应该是 'text' 或 'html'
            status: 1,
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).toThrow('"content" 字段必须是以下选项之一：text,html')
    })

    // 测试数组类型验证
    it('should throw an error if an array field is not an array', () => {
        const config = {
            name: 'John',
            age: 25,
            isActive: true,
            content: 'text',
            status: 1,
            list: 'not an array', // 应该是数组
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).toThrow('"list" 字段必须是数组！')
    })

    // 测试对象类型验证
    it('should throw an error if an object field is not an object', () => {
        const config = {
            name: 'John',
            age: 25,
            isActive: true,
            content: 'text',
            status: 1,
            list: [],
            settings: 'not an object', // 应该是对象
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).toThrow('"settings" 字段必须是对象！')
    })

    // 测试布尔类型验证
    it('should throw an error if a boolean field is not a boolean', () => {
        const config = {
            name: 'John',
            age: 25,
            isActive: 'true', // 应该是布尔值
            status: 1,
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).toThrow('"isActive" 字段必须是布尔值！')
    })

    // 测试字符串类型验证
    it('should throw an error if a string field is not a string', () => {
        const config = {
            name: 123, // 应该是字符串
            age: 25,
            isActive: true,
            status: 1,
        }

        expect(() => validate<TestConfigSchema>(config as any, configSchema as any)).toThrow('"name" 字段必须是字符串！')
    })
})
