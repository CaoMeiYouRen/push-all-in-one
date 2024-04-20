let colors: any

if (globalThis.process && typeof globalThis.process.on === 'function') {
    import('@colors/colors').then((value) => {
        colors = value.default
    }).catch(console.error)
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

/**
 * 检测是否为 http/https 开头的 url
 * @param url
 * @returns
 */
export const isHttpURL = (url: string) => /^(https?:\/\/)/.test(url)

/**
 * 检测是否为 socks/socks5 开头的 url
 * @param url
 * @returns
 */
export const isSocksUrl = (url: string) => /^(socks5?:\/\/)/.test(url)
