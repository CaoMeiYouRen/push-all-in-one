import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { ServerChanTurbo } from './server-chan-turbo'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('ServerChanTurbo', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new ServerChanTurbo({ SERVER_CHAN_TURBO_SENDKEY: '' })).toThrow('"SERVER_CHAN_TURBO_SENDKEY" 字段是必须的！')
    })

    it('should send push request', async () => {
        const serverChanTurbo = new ServerChanTurbo({ SERVER_CHAN_TURBO_SENDKEY: 'SCTtestkey123' })
        const result = await serverChanTurbo.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 0 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://sctapi.ftqq.com/SCTtestkey123.send')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/x-www-form-urlencoded',
        })
        expect(config.data).toEqual({
            text: '测试标题',
            desp: '测试内容',
        })
    })

    it('should convert noip option to string', async () => {
        const serverChanTurbo = new ServerChanTurbo({ SERVER_CHAN_TURBO_SENDKEY: 'SCTtestkey123' })
        await serverChanTurbo.send('测试标题', '', { noip: 1 })
        const [config] = mockedAjax.mock.calls[0]
        expect((config.data as any).noip).toBe('1')
    })
})
