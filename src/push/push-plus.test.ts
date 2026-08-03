import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { PushPlus } from './push-plus'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('PushPlus', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 200 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new PushPlus({ PUSH_PLUS_TOKEN: '' })).toThrow('"PUSH_PLUS_TOKEN" 字段是必须的！')
    })

    it('should send push request', async () => {
        const pushplus = new PushPlus({ PUSH_PLUS_TOKEN: 'pushplustoken123' })
        const result = await pushplus.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 200 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('http://www.pushplus.plus/send')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(config.data).toEqual({
            token: 'pushplustoken123',
            title: '测试标题',
            content: '测试内容',
            template: 'html',
            channel: 'wechat',
        })
    })

    it('should use title as content when desp is empty and merge option', async () => {
        const pushplus = new PushPlus({ PUSH_PLUS_TOKEN: 'pushplustoken123' })
        await pushplus.send('仅标题', '', { template: 'txt', channel: 'cp' })
        const [config] = mockedAjax.mock.calls[0]
        expect((config.data as any).content).toBe('仅标题')
        expect((config.data as any).template).toBe('txt')
        expect((config.data as any).channel).toBe('cp')
    })
})
