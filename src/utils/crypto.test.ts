import { generateSignature, base64Encode, rfc2047Encode } from './crypto'

describe('generateSignature', () => {
    it('should generate correct signature', () => {
        const timestamp = '1604000000'
        const suiteTicket = 'suite_ticket'
        const suiteSecret = 'suite_secret'
        const expectedSignature = 'g6zSsTYaHijVbTCIDP2ypYviTry0T0m27zfbJfMQ++U='
        const signature = generateSignature(timestamp, suiteTicket, suiteSecret)
        expect(signature).toBe(expectedSignature)
    })
    it('should generate different signature for different timestamp', () => {
        const signature1 = generateSignature('1604000000', 'ticket', 'secret')
        const signature2 = generateSignature('1604000001', 'ticket', 'secret')
        expect(signature1).not.toBe(signature2)
    })
    it('should accept number timestamp', () => {
        const signature = generateSignature(1604000000, 'ticket', 'secret')
        expect(typeof signature).toBe('string')
        expect(signature.length).toBeGreaterThan(0)
    })
})

describe('base64Encode', () => {
    it('should encode string to base64', () => {
        expect(base64Encode('hello')).toBe('aGVsbG8=')
    })
    it('should encode utf-8 string', () => {
        expect(base64Encode('你好')).toBe('5L2g5aW9')
    })
})

describe('rfc2047Encode', () => {
    it('should wrap base64 string with utf-8 header', () => {
        expect(rfc2047Encode('你好')).toBe('=?utf-8?B?5L2g5aW9?=')
    })
})
