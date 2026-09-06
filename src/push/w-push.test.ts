import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { WPush } from './w-push'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('WPush', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new WPush({ WPUSH_APIKEY: '' })).toThrow('"WPUSH_APIKEY" 字段是必须的！')
    })

    it('should send push request', async () => {
        const wpush = new WPush({ WPUSH_APIKEY: 'WPUSHtestdummykey123' })
        const result = await wpush.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 0 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://api.wpush.cn/api/v1/send')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(config.data).toEqual({
            apikey: 'WPUSHtestdummykey123',
            title: '测试标题',
            content: '测试内容',
            channel: 'wechat',
        })
    })

    it('should use title as content when desp is empty and merge option', async () => {
        const wpush = new WPush({ WPUSH_APIKEY: 'WPUSHtestdummykey123' })
        await wpush.send('仅标题', '', { channel: 'feishu', topic_code: 'topic-abc' })
        const [config] = mockedAjax.mock.calls[0]
        expect((config.data as any).content).toBe('仅标题')
        expect((config.data as any).channel).toBe('feishu')
        expect((config.data as any).topic_code).toBe('topic-abc')
    })
})
