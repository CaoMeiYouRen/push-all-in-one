// 是否是联合类型
type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : never
/**
 * 判断类型是否相同
 */
type Equal<Left, Right> =
    (<U>() => U extends Left ? 1 : 0) extends (<U>() => U extends Right ? 1 : 0) ? true : false

/**
 * 判断字段是否必填
 */
type IsRequired<T> = Equal<Required<T>, T>

export type Config = {
    [key: string]: any
}

/**
 * 配置 Schema
 * 如果字段的类型是 string，则生成的 Schema 类型为 string
 * 如果字段的类型是 number，则生成的 Schema 类型为 number
 * 如果字段的类型是 boolean，则生成的 Schema 类型为 boolean
 * 如果字段的类型是 object，则生成的 Schema 类型为 object
 * 如果字段的类型是 array，则生成的 Schema 类型为 array
 * 如果字段的类型是 联合 number 类型(1 | 2 | 3)，则生成的 Schema 类型为 select
 * 如果字段的类型是 联合 string 类型('text' | 'html')，则生成的 Schema 类型为 select
 *  (IsUnion<T[K]> extends true ? 'select' : never)
 */
export type ConfigSchema<T = Config> = {
    [K in keyof T]: {
        // 字段类型
        type: IsUnion<T[K]> extends true ? 'select' : (
            T[K] extends string ? 'string' : (
                T[K] extends number ? 'number' : (
                    T[K] extends boolean ? 'boolean' : (
                        T[K] extends any[] ? 'array' : (
                            T[K] extends object ? 'object' : (
                                'select'
                            )
                        )
                    )
                )
            )
        )

        // 字段名称
        title?: string
        // 字段描述
        description?: string
        // 字段是否必填
        required: IsRequired<Pick<T, K>>
        // 字段默认值
        default?: T[K]
        // 字段选项，仅当字段类型为 select 时有效
        options?: IsUnion<T[K]> extends true ? {
            // 选项名称
            label: string
            // 选项值
            value: T[K] // 选项值的类型跟字段的类型一致
        }[] : never
    }
}

// type ConfigA = {
//     name: string
//     age?: number
//     isActive: boolean
//     content?: 'text' | 'html'
//     status: 1 | 2 | 3
// }

// type ConfigSchemaA = ConfigSchema<ConfigA>

// const a: ConfigSchemaA = {
//     name: {
//         type: 'string',
//         title: '',
//         description: '',
//         required: true,
//         default: '',
//     },
//     age: {
//         type: 'number',
//         title: '',
//         description: '',
//         required: false,
//         default: 0,
//     },
//     isActive: {
//         type: 'boolean',
//         title: '',
//         description: '',
//         required: true,
//         default: false,
//         options: [
//             {
//                 label: '是',
//                 value: true,
//             },
//             {
//                 label: '否',
//                 value: false,
//             },
//         ],
//     },
//     content: {
//         type: 'string',
//         title: '',
//         description: '',
//         required: false,
//         default: 'text',
//         options: [
//             {
//                 label: '文本',
//                 value: 'text',
//             },
//             {
//                 label: 'HTML',
//                 value: 'html',
//             },
//         ],
//     },
//     status: {
//         type: 'number',
//         title: '',
//         description: '',
//         required: true,
//         default: 1,
//         options: [
//             {
//                 label: '1',
//                 value: 1,
//             },
//             {
//                 label: '2',
//                 value: 2,
//             },
//             {
//                 label: '3',
//                 value: 3,
//             },
//         ],
//     },
// }

export type Option = {
    [key: string]: any
}

export type OptionSchema<T = Option> = ConfigSchema<T>

