import { generateSignature } from './crypto'
// 生成 generateSignature 的jest 测试用例
describe('generateSignature', () => {
    it('should generate correct signature', () => {
        const timestamp = '1604000000'
        const suiteTicket = 'suite_ticket'
        const suiteSecret = 'suite_secret'
        const expectedSignature = 'g6zSsTYaHijVbTCIDP2ypYviTry0T0m27zfbJfMQ++U='
        const signature = generateSignature(timestamp, suiteTicket, suiteSecret)
        expect(signature).toBe(expectedSignature)
    })
})
