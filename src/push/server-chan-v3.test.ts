import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { ServerChanV3 } from './server-chan-v3'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('ServerChanV3', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new ServerChanV3({ SERVER_CHAN_V3_SENDKEY: '' })).toThrow('"SERVER_CHAN_V3_SENDKEY" 字段是必须的！')
    })

    it('should throw error when sendkey is invalid', () => {
        expect(() => new ServerChanV3({ SERVER_CHAN_V3_SENDKEY: 'invalid-key' })).toThrow('SERVER_CHAN_V3_SENDKEY 不合法！')
    })

    it('should send push request', async () => {
        const serverChanV3 = new ServerChanV3({ SERVER_CHAN_V3_SENDKEY: 'sctp442txxx' })
        const result = await serverChanV3.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 0 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://442.push.ft07.com/send/sctp442txxx.send')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(config.data).toEqual({
            text: '测试标题',
            desp: '测试内容',
        })
    })

    it('should join tags array with separator', async () => {
        const serverChanV3 = new ServerChanV3({ SERVER_CHAN_V3_SENDKEY: 'sctp442txxx' })
        await serverChanV3.send('测试标题', '测试内容', { tags: ['a', 'b'] } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect((config.data as any).tags).toBe('a|b')
    })
})
