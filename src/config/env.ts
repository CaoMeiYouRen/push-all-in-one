export const __PROD__ = process.env.NODE_ENV === 'production'
export const __DEV__ = process.env.NODE_ENV === 'development'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export const __BROWSER__ = typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs
