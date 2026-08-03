let colors: any

if (globalThis.process && typeof globalThis.process.on === 'function') {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        colors = require('@colors/colors')
    } catch {
        import('@colors/colors').then((value) => {
            colors = value.default
        }).catch(console.error)
    }
}

export function warn(text: any): void {
    if (colors) {
        text = colors.yellow(text)
    }
    console.warn(text)
}

export function error(text: any): void {
    if (colors) {
        text = colors.red(text)
    }
    console.error(text)
}

export const logger = {
    warn,
    error,
}

/**
 * 检测是否为 http/https 开头的 url
 * @param url
 * @returns
 */
export const isHttpURL = (url: string): boolean => /^(https?:\/\/)/.test(url)

/**
 * 检测是否为 socks/socks5 开头的 url
 * @param url
 * @returns
 */
export const isSocksUrl = (url: string): boolean => /^(socks5?:\/\/)/.test(url)

/**
 * 判断是否为 null 或 undefined
 * @param value
 * @returns
 */
export function isNil(value: unknown): boolean {
    return value === null || value === undefined
}

/**
 * 判断是否不为 null 且不为 undefined
 * @param value
 * @returns
 */
export function isNotNil(value: unknown): boolean {
    return !isNil(value)
}

/**
 *  判断是否为 null 或 undefined 或 空字符串
 * @param value
 * @returns
 */
export function isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === ''
}
/**
 * 判断是否不为 null 且不为 undefined 且不为 空字符串
 * @param value
 * @returns
 */
export function isNotEmpty(value: unknown): boolean {
    return !isEmpty(value)
}

/**
 *  数组去重
 *
 * @author CaoMeiYouRen
 * @date 2025-03-05
 * @export
 * @template T
 * @param arr
 */
export function uniq<T>(arr: T[]): T[] {
    return Array.from(new Set(arr))
}

/**
 * 对密钥/敏感信息进行脱敏处理，仅保留前 4 位，其余用 * 替换
 *
 * @author CaoMeiYouRen
 * @date 2026-08-03
 * @export
 * @param secret 敏感信息
 */
export function maskSecret(secret: string | null | undefined): string {
    if (!secret) {
        return ''
    }
    if (secret.length <= 4) {
        return '****'
    }
    return `${secret.slice(0, 4)}***`
}

const SENSITIVE_KEY_PATTERN = /secret|token|password|passwd|pass|auth|key|webhook/i

/**
 * 递归脱敏对象中的敏感字段
 * key 包含 secret/token/password/auth/key/webhook 等关键词时，值将被脱敏
 *
 * @author CaoMeiYouRen
 * @date 2026-08-03
 * @export
 * @template T
 * @param value 原始数据
 * @param [key] 当前字段名
 */
export function maskSensitiveData<T>(value: T, key?: string): T {
    if (typeof value === 'string' && key && SENSITIVE_KEY_PATTERN.test(key)) {
        return maskSecret(value) as T
    }
    if (Array.isArray(value)) {
        return value.map((item) => maskSensitiveData(item, key)) as T
    }
    if (value && typeof value === 'object') {
        const result: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(value)) {
            result[k] = maskSensitiveData(v, k)
        }
        return result as T
    }
    return value
}
