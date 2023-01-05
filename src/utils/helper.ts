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
