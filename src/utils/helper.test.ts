import { isHttpURL, isSocksUrl, isNil, isNotNil } from './helper'

describe('helper', () => {
    it('isHttpURL', () => {
        expect(isHttpURL('http://127.0.0.1')).toBe(true)
        expect(isHttpURL('https://127.0.0.1')).toBe(true)
        expect(isHttpURL('test')).toBe(false)
    })
    it('isSocksUrl', () => {
        expect(isSocksUrl('socks5://127.0.0.1')).toBe(true)
        expect(isSocksUrl('socks://127.0.0.1')).toBe(true)
        expect(isSocksUrl('test')).toBe(false)
    })
    it('isNil', () => {
        expect(isNil(null)).toBe(true)
        expect(isNil(undefined)).toBe(true)
        expect(isNil({})).toBe(false)
    })
    it('isNotNil', () => {
        expect(isNotNil(null)).toBe(false)
        expect(isNotNil(undefined)).toBe(false)
        expect(isNotNil({})).toBe(true)
    })
})

