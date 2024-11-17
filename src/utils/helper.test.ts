import { isHttpURL, isSocksUrl, isNil, isNotNil, isEmpty, isNotEmpty } from './helper'

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
    it('isEmpty', () => {
        expect(isEmpty([])).toBe(false)
        expect(isEmpty({})).toBe(false)
        expect(isEmpty('')).toBe(true)
        expect(isEmpty(0)).toBe(false)
        expect(isEmpty(null)).toBe(true)
        expect(isEmpty(undefined)).toBe(true)
        expect(isEmpty({ a: 1 })).toBe(false)
        expect(isEmpty([1])).toBe(false)
        expect(isEmpty('test')).toBe(false)
        expect(isEmpty(1)).toBe(false)
    })
    it('isNotEmpty', () => {
        expect(isNotEmpty([])).toBe(true)
        expect(isNotEmpty({})).toBe(true)
        expect(isNotEmpty('')).toBe(false)
        expect(isNotEmpty(0)).toBe(true)
        expect(isNotEmpty(null)).toBe(false)
        expect(isNotEmpty(undefined)).toBe(false)
        expect(isNotEmpty({ a: 1 })).toBe(true)
        expect(isNotEmpty([1])).toBe(true)
        expect(isNotEmpty('test')).toBe(true)
        expect(isNotEmpty(1)).toBe(true)
    })
})

