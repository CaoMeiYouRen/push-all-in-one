import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { WxPusher } from './wx-pusher'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('WxPusher', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 1000 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new WxPusher({ WX_PUSHER_APP_TOKEN: '', WX_PUSHER_UID: '' })).toThrow('"WX_PUSHER_APP_TOKEN" 字段是必须的！')
    })

    it('should send push request with default uid', async () => {
        const wxPusher = new WxPusher({
            WX_PUSHER_APP_TOKEN: 'AT_apptoken123',
            WX_PUSHER_UID: 'UID_default',
        })
        const result = await wxPusher.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 1000 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://wxpusher.zjiecode.com/api/send/message')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(config.data).toEqual({
            appToken: 'AT_apptoken123',
            content: '测试标题\n测试内容',
            contentType: 1,
            uids: ['UID_default'],
        })
    })

    it('should merge uids without duplicates', async () => {
        const wxPusher = new WxPusher({
            WX_PUSHER_APP_TOKEN: 'AT_apptoken123',
            WX_PUSHER_UID: 'UID_default',
        })
        await wxPusher.send('测试标题', '', { contentType: 3, uids: ['UID_1', 'UID_default'] } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect((config.data as any).uids).toEqual(['UID_1', 'UID_default'])
        expect((config.data as any).contentType).toBe(3)
    })
})
